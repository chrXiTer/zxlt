"use strict";

var port = process.env.PORT || 5050;
var app = require('http').createServer(handler);    
var fs = require('fs');
var WebSocketServer = require('ws').Server;

app.listen(port);
console.log("ok " + port);
addAChatRoom('%E6%A0%B7%E6%9C%AC%E8%81%8A%E5%A4%A9%E5%AE%A4');

function addAChatRoom(CharRoomName){
    var onlineUsers = new Map();
    var wss = new WebSocketServer({path:"/" + CharRoomName, server:app});
    wss.on('connection', function(ws){
        onconnection(ws, onlineUsers);
    });
}

function handler (req, res) {
    console.log(req.url);
    var contentType;
    if(req.url.search(/.css$/) != -1){
        contentType ="text/css";
    }else if(req.url.search(/.js$/) != -1){
        contentType ="text/javascript";
    }else if(req.url.search(/(.html?$|\/)/) != -1){
        contentType = 'text/html';
    }else{
        contentType = 'text/json';
    }
    
    var filePath = __dirname + req.url;
    if(req.url.search(/^\/$/) != -1){
        filePath = filePath + 'html/index.html';
    }else if(req.url.search(/^\/addChatRoom\//) != -1){
        var newChatRoomName = req.url.replace(/^\/addChatRoom\//, "")
        console.log("addAChatRoom " + newChatRoomName);
        addAChatRoom(newChatRoomName);
        res.writeHead(200, {'Content-Type': contentType});
        res.end("ok");
        return;
    }
    
    fs.readFile(filePath, function (err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
        }
        res.writeHead(200, {'Content-Type': contentType});
        res.end(data);
    });
}

function broadcastUserEnterOrLeave(user, onlineUsers, enterOrLeave){
    //var allUsers =  [...onlineUsers.values()];
    var allOnlineUsers = [];
    for(let u of onlineUsers.values()){
        allOnlineUsers.push(u);
    }
    var replyObj;
    if(enterOrLeave === "enter"){
        replyObj={type:"userEnter", user:user,allOnlineUsers:allOnlineUsers};
    }else{ //enterOrLeave === "leave"
        replyObj={type:"userLeave", user:user,allOnlineUsers:allOnlineUsers};
    }
    var replyStr = JSON.stringify(replyObj);
    onlineUsers.forEach(function (value, key) {
       key.send(replyStr);
    });
}

function onconnection(ws, onlineUsers) {
    console.log('connection');
    onlineUsers.set(ws, null);
    ws.on('open', function(message){
        console.log('open: %s', message);
    })
    
    ws.on('message', function(message) {
        console.log('received: %s', message);
        var msgObj = JSON.parse(message);
        if(msgObj.type === "login"){
            var newUser = {userid:msgObj.userid, username:msgObj.username};
            onlineUsers.set(ws, newUser);
            broadcastUserEnterOrLeave(newUser, onlineUsers, "enter");
        }else if(msgObj.type === "chat"){
            var userOfMessageFrom = onlineUsers.get(ws);
            onlineUsers.forEach(function (value, key) {
                var replyObj;
                if(key != ws){
                    replyObj={type:"chatMessage", from:userOfMessageFrom.userid, content:msgObj.content};
                    var replyStr = JSON.stringify(replyObj);
                    key.send(replyStr);
                }else{
                    ;//replyObj={type:"system", content:"ok"};
                }
            });
        }
    });
    
    ws.on('close', function(code, message){
        var leavedUser = onlineUsers.get(ws);
        console.log(leavedUser.username +  ' close');
        onlineUsers.delete(ws);  //此时已经不能向ws发送消息，所以需要在广播离开消息前将ws从onlineUsers中删掉
        broadcastUserEnterOrLeave(leavedUser, onlineUsers, "leave");
        
    })
}




