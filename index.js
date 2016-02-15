"use strict";

var port = process.env.PORT || 5050;
var app = require('http').createServer(handler);    
var fs = require('fs');
app.listen(port);
console.log("ok " + port);

var onlineUsers = new Map();
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({path:"/chat1", server:app});
wss.on('connection', onconnection);

function handler (req, res) {
    console.log(req.url);
    var contentType = 'text/html';
    if(req.url.indexOf('.css') != -1){
        contentType ="text/css";
    }else if(req.url.indexOf('.js') != -1){
        contentType ="text/javascript";
    }
    var filePath = __dirname + req.url;
    if(req.url.charAt(req.url.length - 1) ==  "/"){
        filePath = filePath + 'index.html';
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
  
function onconnection(ws) {
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
            //var allUsers =  [...onlineUsers.values()];
            var allUsers = [];
            for(let u of onlineUsers.values()){
                allUsers.push(u);
            }
            onlineUsers.forEach(function (value, key) {
                var replyObj={type:"refreshUserList", newUser:newUser,content:allUsers};
                    var replyStr = JSON.stringify(replyObj);
                    key.send(replyStr);
            });
        }if(msgObj.type === "chat"){
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

            })
        }
    });
    
    ws.on('close', function(code, message){
        console.log('close');
        onlineUsers.delete(ws);
    })
}



/*
io.on('connection', function(socket){
    console.log('a user connected');
    socket.send('rrr');

    socket.on('disconnect', function(){//监听用户退出
        if(onlineUsers.has(socket.name)) {//将退出的用户从在线列表中删除
            let obj = {userid:socket.name, username:onlineUsers[socket.name]};
            onlineUsers.delete(socket.name);//删除

            io.emit('message', {onlineUsers:onlineUsers, user:obj});//向所有客户端广播用户退出
            console.log(obj.username+'退出了聊天室');
        }
    });
    
    socket.on('message', function(message){
        console.log('Reserv message ');
        console.log(message);
        socket.send("12345");//向所有客户端广播用户加入
        io.send("67890");//向所有客户端广播用户加入   
        socket.emit("ddd", '123');
        io.emit('eee', '456');
    });
});
*/




