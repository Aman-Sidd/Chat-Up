
const input = document.getElementById('message');
const submit = document.getElementById('button');
const display = document.getElementById('display');
const ShowUsers = document.getElementById('ShowUsers');
const yourChats = document.getElementById('yourChats');
const { Username } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

var flag = 0;
var socket = io();
// var Username = window.prompt("Enter your name: ");
var disp = '';
let userIdOfUser;
let recipientUsername;
var checkHead = [];
var publicChat = [];

function hamburger(){
    if(document.getElementsByClassName('showChats')[0].style.width === "61%"){
        document.getElementsByClassName('showChats')[0].style.width="0";
    }
    else {
        document.getElementsByClassName('showChats')[0].style.width = "61%";
       
    }
}

// Function to Notify when someone New user joined the chat
function joinNotifier(uname) {
    let para = document.createElement('p');
    para.className = 'para';
    let span = document.createElement('span');
    let text = document.createTextNode(uname + ' joined the chat');
    span.appendChild(text);
    para.appendChild(span);
    display.appendChild(para);
}

// Function to Notify when someone existing user leave the chat
function leftNotifier(uname) {
    let para = document.createElement('p');
    para.className = 'para';
    let span = document.createElement('span');
    let text = document.createTextNode(uname + ' left the chat');
    span.appendChild(text);
    para.appendChild(span);
    display.appendChild(para);
    console.log('working')
}

// Code to Show UserName on joining the chat
socket.emit('JoiningEvent', Username);
socket.on('recieveJoiningName', (username, date) => {
    if (flag === 0) {
        joinNotifier(username);
        publicChat.push({ html: `<p class="para"><span>${username} joined the chat</span></p>` })
    }
    else publicChat.push({ html: `<p class="para"><span>${username} joined the chat</span></p>` })
})

// Code to Show UserName on Leaving the chat
socket.on('DC', (leftuser) => {
    if (flag === 0) {
        leftNotifier(leftuser);
        publicChat.push({ html: `<p class="para"><span>${leftuser} left the chat</span></p>` })
    }
    else publicChat.push({ html: `<p class="para"><span>${leftuser} left the chat</span></p>` })
})
var rFlag = 0;
// Code to Show Online Users
var tempData = [];
var tempUserId;
socket.on('OnlineUsers', (uData, cnt) => {

    var listHtml = '';
    for (let x in uData) {
        if (uData[x].id === socket.id) {
            listHtml += `<li class="pp" onclick="getInfo(event)"><span class="dot"></span>${uData[x].username} (you)</li><div style="display:none">${uData[x].id}</div>`
        }
        else {
            listHtml += `<li class="pp" onclick="getInfo(event)"><span class="dot"></span>${uData[x].username}</li><div style="display:none">${uData[x].id}</div>`
        }
        let tempId = uData[x].id;
        checkHead.push({ usersId: tempId, status: false })
    }

    let onlineHtml = `<div style="
    font-size: 21px;
    text-align: center;
    padding-top: 10px;
    margin: 0px 0 0 0;
    padding-bottom: 4px;
    background-color: #ffffff;
    color: rgb(51 43 43);
        "><h3> <i class="fa fa-user-circle-o"></i>Online Users : ${cnt}</h3></div>
        <div style="overflow: auto;
        height: 436px;
        background-color: #fcf9fe;">
        <ul>
        ${listHtml}
        </ul></div>`;
    let bottomMostHtml = `<div id='returnBack'><h4 id="returnBackh4"><i class="fa fa-backward" style="margin-right: 8px;"></i>Public Chat</h4></div>`;

    ShowUsers.innerHTML = onlineHtml + bottomMostHtml;

    console.log('rFlag --> ', rFlag);
    console.log('tempData ', tempData);

    let returnBackh4 = document.getElementById('returnBackh4');
    returnBackh4.addEventListener('click', () => {
        tempUserId = userIdOfUser;
        userIdOfUser = null;
        recipientUsername = null;
        let htm = '';
        for (let x in publicChat) {
            htm += publicChat[x].html;
        }
        display.innerHTML = `<div class="displayName"><h3><span id="hamburger" onclick="hamburger();"><i class="fa fa-bars"></i></span><i class="fa fa-users"></i>Public Chat</h3></div>` + htm;
        display.scrollTop = display.scrollHeight;
        console.log('disp ==> ' + disp);
        console.log('-----------')
        console.log('htm===> ', htm);
        flag = 0;
    })
})

// To get userID of the recipient when clicked on DM
var userArray = [];
function getInfo(event) {
    console.log(userArray);
    userIdOfUser = event.target.nextElementSibling.textContent;
    recipientUsername = event.target.textContent;
    if (userIdOfUser !== socket.id) {
        display.innerHTML = `<div class="displayName"><h3><span id="hamburger" onclick="hamburger();"><i class="fa fa-bars"></i></span><i class="fa fa-users"></i>${recipientUsername}</h3></div>`;
        let htm = `<div class="displayName"><h3><span id="hamburger" onclick="hamburger();"><i class="fa fa-bars"></i></span><i class="fa fa-users"></i>${recipientUsername}</h3></div>`;
        let len = htm.length;
        for (let x in userArray) {
            if (userArray[x].recipientUserId === userIdOfUser) {
                htm += userArray[x].html;
            }
        }
        console.log('htm before slice -->  ', htm);
        let actualStr = htm;
        if (htm.includes(`<div class="displayName"><h3><span id="hamburger" onclick="hamburger();"><i class="fa fa-bars"></i></span><i class="fa fa-users"></i>${recipientUsername}</h3></div><div class="displayName"><h3><span id="hamburger" onclick="hamburger();"><i class="fa fa-bars"></i></span><i class="fa fa-users"></i>${recipientUsername}</h3></div>`)) {
            actualStr = htm.slice(len, htm.length);
            console.log('htm after slice --> ', actualStr);
        }
        display.innerHTML = actualStr;
        flag = 1;
    }
}

function getInfo2(event) {

    userIdOfUser = event.target.parentElement.nextElementSibling.textContent;
    recipientUsername = event.target.textContent;

    let time = event.target.querySelector('span').textContent;
    let str = recipientUsername.search(time);
    recipientUsername = recipientUsername.slice(0, str);
    ourChats.find((post) => {
        if (post.id === userIdOfUser) {
            if (post.count !== 0) {
                event.target.nextElementSibling.querySelectorAll('span')[1].style.display = "none";
            }
        }
    })

    ourChats.find((post) => {
        if (post.id === userIdOfUser) {
            post.count = 0;
        }
    })
    console.log(event.target.nextElementSibling.childNodes);
    console.log('-----getINfo2-----')
    console.log(recipientUsername);
    console.log(userIdOfUser);
    display.innerHTML = `<div class="displayName"><h3><span id="hamburger" onclick="hamburger();"><i class="fa fa-bars"></i></span><i class="fa fa-users"></i>${recipientUsername}</h3></div>`;
    let htm = `<div class="displayName"><h3><span id="hamburger" onclick="hamburger();"><i class="fa fa-bars"></i></span><i class="fa fa-users"></i>${recipientUsername}</h3></div>`;
    let len = htm.length;
    for (let x in userArray) {
        if (userArray[x].recipientUserId === userIdOfUser) {
            htm += userArray[x].html;
        }
    }
    
    console.log('htm before slice -->  ', htm);
    let actualStr = htm;
    if (htm.includes(`<div class="displayName"><h3><span id="hamburger" onclick="hamburger();"><i class="fa fa-bars"></i></span><i class="fa fa-users"></i>${recipientUsername}</h3></div><div class="displayName"><h3><span id="hamburger" onclick="hamburger();"><i class="fa fa-bars"></i></span><i class="fa fa-users"></i>${recipientUsername}</h3></div>`)) {
        actualStr = htm.slice(len, htm.length);
        console.log('htm after slice --> ', actualStr);
    }
    display.innerHTML = actualStr;
    flag = 1;

}

function getInfo3(event) {

    userIdOfUser = event.target.parentElement.nextElementSibling.textContent;
    recipientUsername = event.target.previousElementSibling.textContent;
    let time = event.target.previousElementSibling.querySelector('span').textContent;
    let str = recipientUsername.search(time);
    recipientUsername = recipientUsername.slice(0, str);
    ourChats.find((post) => {
        if (post.id === userIdOfUser) {
            if (post.count !== 0) {
                event.target.querySelectorAll('span')[1].style.display = "none";
            }
        }
    })
    ourChats.find((post) => {
        if (post.id === userIdOfUser) {
            post.count = 0;
        }
    })
    console.log('-----getINfo3-----')
    console.log(recipientUsername);
    console.log(userIdOfUser);
    display.innerHTML = `<div class="displayName"><h3><span id="hamburger" onclick="hamburger();"><i class="fa fa-bars"></i></span><i class="fa fa-users"></i>${recipientUsername}</h3></div>`;
    let htm = `<div class="displayName"><h3><span id="hamburger" onclick="hamburger();"><i class="fa fa-bars"></i></span><i class="fa fa-users"></i>${recipientUsername}</h3></div>`;
    let len = htm.length;
    for (let x in userArray) {
        if (userArray[x].recipientUserId === userIdOfUser) {
            htm += userArray[x].html;
        }
    }
    console.log('htm before slice -->  ', htm);
    let actualStr = htm;
    if (htm.includes(`<div class="displayName"><h3><span id="hamburger" onclick="hamburger();"><i class="fa fa-bars"></i></span><i class="fa fa-users"></i>${recipientUsername}</h3></div><div class="displayName"><h3><span id="hamburger" onclick="hamburger();"><i class="fa fa-bars"></i></span><i class="fa fa-users"></i>${recipientUsername}</h3></div>`)) {
        actualStr = htm.slice(len, htm.length);
        console.log('htm after slice --> ', actualStr);
    }
    display.innerHTML = actualStr;
    flag = 1;
}

// Sending Messages
function displayMessage(message, time) {
    if (message !== '') {
        let ul = document.createElement('ul');
        ul.className = 'right-list';
        let li = document.createElement('li');
        li.innerHTML = `<span class='time'>${time}</span>${message}`;
        let div = document.createElement('div');
        div.className = "senderName";
        div.textContent = 'You';
        ul.appendChild(div);
        ul.appendChild(li);
        display.appendChild(ul);
        console.log(input.value);
        input.value = '';
        display.scrollTop = display.scrollHeight;
    }
}


//Incoming Messages
function incomingMessage(message, username, date) {
    if (message !== '') {
        let ul = document.createElement('ul');
        ul.className = 'left-list';
        let li = document.createElement('li');
        li.innerHTML = `<span class='time'>${date}</span>${message}`;
        let div = document.createElement('div');
        div.className = 'senderName';
        let txt2 = document.createTextNode(username);
        console.log('msg coming from ', username);
        div.appendChild(txt2);
        ul.appendChild(li);
        ul.appendChild(div);
        display.appendChild(ul);
        display.scrollTop = display.scrollHeight;
    }
}

//  format for time in Am/Pm 
function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

var ourChats = [];
var incomingMsgCount = [];
// Click Send Button to send message. 
submit.addEventListener('click', () => {
    if (flag === 0) {
        let msg = input.value;
        var moment_date = moment();
        displayMessage(msg, moment_date.format('h:mm a'));
        socket.emit('message', msg, Username);
        display.scrollTop = display.scrollHeight;
        disp = display.innerHTML;
        publicChat.push({
            html: `<ul class="right-list">
            <div class="senderName">You</div>
        <li><span class="time">${moment_date.format('h:mm a')}</span>${msg}</li> 
    </ul>`})
    }
    if (flag === 1) {
        console.log('user_Id-->', userIdOfUser);
        console.log('flag-->', flag);
        let msg = input.value;
        console.log('msg--> ', msg);
        console.log('Username -->', Username);
        var moment_date = moment();
        displayMessage(msg, moment_date.format('h:mm a'));
        socket.emit('PrivateMsg', msg, Username, userIdOfUser);
        display.scrollTop = display.scrollHeight;
        const inDex = ourChats.findIndex(post => post.id === userIdOfUser);
        if (inDex === -1) {
            ourChats.push({ id: userIdOfUser, user_name: recipientUsername, Time: moment_date.format('h:mm a'), Msg: msg, count: 0 });
        }
        else {
            ourChats[inDex].user_name = recipientUsername;
            ourChats[inDex].Time = moment_date.format('h:mm a');
            ourChats[inDex].Msg = msg;
            ourChats[inDex].count = 0;
        }

        let fullHtml = '';
        for (let i = ourChats.length - 1; i >= 0; i--) {
            if (ourChats[i].count === 0) {
                fullHtml += `<div class="chats"><p onclick="getInfo2(event);" class="showChats_innerContent1">${ourChats[i].user_name}<span class="showChats_innerContent2">${ourChats[i].Time}</span></p><p onclick="getInfo3(event);" class="showChats_innerContent3"><span>${ourChats[i].Msg}</span><span></span></p></div><p style="display:none">${ourChats[i].id}</p>`;
            }
            else {
                fullHtml += `<div class="chats"><p onclick="getInfo2(event);" class="showChats_innerContent4">${ourChats[i].user_name}<span class="showChats_innerContent5">${ourChats[i].Time}</span></p><p onclick="getInfo3(event);" class="
            showChats_innerContent6"><span class="showChats_innerContent7">${ourChats[i].Msg}</span><span class="spanTxt">${ourChats[i].count}</span></p></div><p style="display:none">${ourChats[i].id}</p>`;
            }
        }
        yourChats.innerHTML = fullHtml;
        let privateMsgHtml = {
            recipientUserId: userIdOfUser,
            html: display.innerHTML
        }
        let index = userArray.findIndex(post => post.recipientUserId === userIdOfUser)
        if (index !== -1)
            userArray[index].html = display.innerHTML;
        else
            userArray.push(privateMsgHtml);
    }
})

// Keypress Enter to Send 
input.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        if (flag === 0) {
            let msg = input.value;
            var moment_date = moment();
            displayMessage(msg, moment_date.format('h:mm a'));
            socket.emit('message', msg, Username);
            display.scrollTop = display.scrollHeight;
            disp = display.innerHTML;
            publicChat.push({
                html: `<ul class="right-list">
                <div class="senderName">You</div>
            <li><span class="time">${moment_date.format('h:mm a')}</span>${msg}</li> 
        </ul>`})

        }
        if (flag === 1) {
            console.log('user_Id-->', userIdOfUser);
            console.log('flag-->', flag);
            let msg = input.value;
            console.log('msg--> ', msg);
            console.log('Username -->', Username);
            var moment_date = moment();
            displayMessage(msg, moment_date.format('h:mm a'));
            socket.emit('PrivateMsg', msg, Username, userIdOfUser);
            display.scrollTop = display.scrollHeight;
            const inDex = ourChats.findIndex(post => post.id === userIdOfUser);
            if (inDex === -1) {
                ourChats.push({ id: userIdOfUser, user_name: recipientUsername, Time: moment_date.format('h:mm a'), Msg: msg, count: 0 });
            }
            else {
                ourChats[inDex].user_name = recipientUsername;
                ourChats[inDex].Time = moment_date.format('h:mm a');
                ourChats[inDex].Msg = msg;
                ourChats[inDex].count = 0;
            }

            let fullHtml = '';
            for (let i = ourChats.length - 1; i >= 0; i--) {
                if (ourChats[i].count === 0) {
                   fullHtml += `<div class="chats"><p onclick="getInfo2(event);" class="showChats_innerContent1">${ourChats[i].user_name}<span class="showChats_innerContent2">${ourChats[i].Time}</span></p><p onclick="getInfo3(event);" class="showChats_innerContent3"><span>${ourChats[i].Msg}</span><span></span></p></div><p style="display:none">${ourChats[i].id}</p>`;
                }
                else {
                    fullHtml += `<div class="chats"><p onclick="getInfo2(event);" class="showChats_innerContent4">${ourChats[i].user_name}<span class="showChats_innerContent5">${ourChats[i].Time}</span></p><p onclick="getInfo3(event);" class="
                    showChats_innerContent6"><span class="showChats_innerContent7">${ourChats[i].Msg}</span><span class="spanTxt">${ourChats[i].count}</span></p></div><p style="display:none">${ourChats[i].id}</p>`;
                }
            }
            yourChats.innerHTML = fullHtml;
            let privateMsgHtml = {
                recipientUserId: userIdOfUser,
                html: display.innerHTML
            }
            let index = userArray.findIndex(post => post.recipientUserId === userIdOfUser)
            if (index !== -1)
                userArray[index].html = display.innerHTML;
            else
                userArray.push(privateMsgHtml);
        }
    }
    else {
        if (flag === 1) {
            socket.emit('typingStatus', Username, socket.id, userIdOfUser);
        }
    }
});

// Showing Incoming Messages
socket.on('receive-msg', (senderId, username, msg) => {
    if (flag === 0) {
        let time = moment();
        incomingMessage(msg, username, time.format('h:mm a'));
        disp = display.innerHTML;
        publicChat.push({
            userId: senderId, html: `<ul class="left-list">
        <li><span class="time">${time.format('h:mm a')}</span>${msg}</li> 
        <div class="senderName">${username}</div>
    </ul>`})
    }
    else {
        let time = moment();
        publicChat.push({
            userId: senderId, html: `<ul class="left-list">
        <li><span class="time">${time.format('h:mm a')}</span>${msg}</li> 
        <div class="senderName">${username}</div>
    </ul>`})
    }
})

// receiving Private Msg
socket.on('receivePrivateMsg', (senderId, msg, username) => {
    console.log('senderId-->', senderId)
    console.log('msg-->', msg)
    console.log('username-->', username)
    console.log('time-->', time);

    if (senderId === userIdOfUser) {
        console.log("here senderId and userIdOfUser is equal")
        if (flag === 1) {
            let time = moment();
            incomingMessage(msg, username, time.format('h:mm a'));
            let privateMsgHtml = {
                recipientUserId: userIdOfUser,
                html: display.innerHTML
            }
            let index = userArray.findIndex(post => post.recipientUserId === userIdOfUser)
            if (index !== -1)
                userArray[index].html = display.innerHTML;
            else
                userArray.push(privateMsgHtml);

        }
    }
    else {
        let time = moment();
        let privateMsgHtml = {
            recipientUserId: senderId,
            html: `<ul class="left-list">
                 <li><span class="time">${time.format('h:mm a')}</span>${msg}</li> 
                 <div class="senderName">${username}</div>
                 </ul>`
        }
        let index = userArray.findIndex(post => post.recipientUserId === senderId)
        if (index !== -1)
            userArray[index].html += `<ul class="left-list">
            <li><span class="time">${time.format('h:mm a')}</span>${msg}</li> 
            <div class="senderName">${username}</div>
            </ul>`;
        else
            userArray.push(privateMsgHtml);
    }
    if (senderId !== userIdOfUser) {
        let time = moment();
        let indexCount = ourChats.findIndex(post => post.id === senderId);
        if (indexCount !== -1) {
            // incomingMsgCount[indexCount].stats = false;
            ourChats[indexCount].user_name = username;
            ourChats[indexCount].Time = time.format('h:mm a');
            ourChats[indexCount].Msg = msg;
            ourChats[indexCount].count++;
        }
        else {
            ourChats.push({ id: senderId, user_name: username, Msg: msg, Time: time.format('h:mm a'), count: 1 })
        }
        let fullHtml = '';
        for (let i = ourChats.length - 1; i >= 0; i--) {
            if (ourChats[i].count !== 0) {
                fullHtml += `<div class="chats"><p onclick="getInfo2(event);" class="showChats_innerContent4">${ourChats[i].user_name}<span class="showChats_innerContent5">${ourChats[i].Time}</span></p><p onclick="getInfo3(event);" class="
                    showChats_innerContent6"><span class="showChats_innerContent7">${ourChats[i].Msg}</span><span class="spanTxt">${ourChats[i].count}</span></p></div><p style="display:none">${ourChats[i].id}</p>`;
            }
            else {
                fullHtml += `<div class="chats"><p onclick="getInfo2(event);" class="showChats_innerContent4">${ourChats[i].user_name}<span class="showChats_innerContent5">${ourChats[i].Time}</span></p><p onclick="getInfo3(event);" class="showChats_innerContent6"><span>${ourChats[i].Msg}</span></p></div><p style="display:none">${ourChats[i].id}</p>`;
            }
        }
        yourChats.innerHTML = fullHtml;
    }
    else {
        let time = moment();
        const inDex = ourChats.findIndex(post => post.id === senderId);
        if (inDex !== -1) {
            ourChats[inDex].user_name = username;
            ourChats[inDex].Time = time.format('h:mm a');
            ourChats[inDex].Msg = msg;
        }
        else {
            ourChats.push({ id: senderId, user_name: username, Time: time.format('h:mm a'), Msg: msg });
        }

        let fullHtml = '';
        for (let i = ourChats.length - 1; i >= 0; i--) {
            fullHtml += `<div class="chats"><p onclick="getInfo2(event);" class="showChats_innerContent4">${ourChats[i].user_name}<span class="showChats_innerContent5">${ourChats[i].Time}</span></p><p onclick="getInfo3(event);" style="
            font-size: 14px;
            padding: 0px 3px 10px 10px;
            font-family: 'Ubuntu', sans-serif;"><span>${ourChats[i].Msg}</span></p></div><p style="display:none">${ourChats[i].id}</p>`;
        }
        yourChats.innerHTML = fullHtml;
    }
})


var resizeScreen = window.matchMedia("(min-width: 700px)");
resizeScreen.addEventListener('change',(x)=>{
    if(x.matches){
        document.getElementsByClassName('showChats')[0].style.width = "26%";
    }
})
// Show Typing Status
socket.on('showTyping', (str, senderId) => {

})

