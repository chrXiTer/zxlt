"use strict";



var onlineUsers = new Map();
var host = 'localhost';
var port = process.env.PORT || 5050;


var app = require('http').createServer(handler);
var fs = require('fs');
app.listen(port);
console.log("ok " + port);
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

var WebSocketServer = require('ws').Server
    , wss = new WebSocketServer({port:5060});
  
wss.on('connection', function(ws) {
    console.log('connection');
    onlineUsers.set(ws, null);
    ws.on('message', function(message) {
        console.log('received: %s', message);
        var msgObj = JSON.parse(message);
        
        if(msgObj.type === "login"){
            onlineUsers.set(ws, {userid:msgObj.userid, username:msgObj.username});
            var replyObj = {type:"system", content:"ok"};
            var replyStr = JSON.stringify(replyObj);
            ws.send(replyStr);
        }if(msgObj.type === "chat"){
            var userOfMessageFrom = onlineUsers.get(ws);
            onlineUsers.forEach(function (value, key) {
                var replyObj;
                if(key != ws){
                    replyObj={type:chatMessage, from:userOfMessageFrom.userid, content:msgObj.content};
                }else{
                    replyObj={type:"system", content:"ok"};
                }
                var replyStr = JSON.stringify(replyObj);
                key.send(replyStr);
            })
        }
    });
    ws.send('something');
});



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




