var express = require('express');
const app = express();
var http = require('http');
const server = http.createServer(app);
var { Server } = require('socket.io');
const io = new Server(server);
const path = require('path');
const { userJoin, delUser, _delUser, noOfUser} = require('./imp/userArray.js')
const moment = require('moment');
const port = process.env.PORT || 3000;

app.use(express.static(__dirname+'/public'))

// Database Handling
// const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/chatApp', { useNewUrlParser: true, useUnifiedTopology: true });

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {
//    //   console.log('we are connected');
// });

// const onlineUsersSchema = new mongoose.Schema({
//    name: String,
//    userID: String
// });
// const OnlineUsers = mongoose.model('OnlineUsers', onlineUsersSchema);



// Get Method --Express
app.get('/', function (req, res) {
   res.send(path.join(__dirname, '/index.html'));
});

io.on('connection', (socket) => {
   console.log('A user connected');
   socket.on('JoiningEvent', (username) => {
      const user = userJoin(username, socket.id);
      let cnt = noOfUser();
      io.emit('OnlineUsers', user,cnt);
      socket.broadcast.emit('recieveJoiningName', username);
   })

   socket.on('message', (msg, Username) => {
      console.log(msg, Username);
      var date = moment().format('h:mm a');
      socket.broadcast.emit('receive-msg',socket.id,Username,msg,date);
   })
   
// when someone wants to send private msg
   socket.on('PrivateMsg',(msg,username, user_ID)=>{
     
      console.log('msg:',msg);
      console.log('username:',username);
      console.log('user_ID:',user_ID)
      var date = moment().format('h:mm a');
      console.log("The date is ", date);
      socket.broadcast.to(user_ID).emit('receivePrivateMsg',socket.id,msg, username,date)
      
   })
   socket.on('typingStatus',(senderName, senderId,recieverId )=>{
      let sName = senderName;
      socket.broadcast.to(recieverId).emit('showTyping',sName, senderId);
   })
   // whenever someone disconnects this piece of code executed
   socket.on('disconnect', function () {
      const leftUser = _delUser(socket.id);
      const users = delUser(socket.id);
      let cnt = noOfUser();
      io.emit('DC', leftUser);
      io.emit('OnlineUsers', users,cnt);

      console.log("Successful deletion");
   });

   console.log('A user disconnected');
});

server.listen(port, function () {
   console.log(`listening on ${port}`);
});