var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

//app.listen(80);
app.listen(process.env.PORT || 5050)
console.log("ok" + process.env.PORT)

function handler (req, res) {
    console.log(req.url);
    var contentType = 'text/html';
    if(req.url.indexOf('.css') != -1){
        contentType ="text/css";
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

var onlineUsers = {};
var onlineCount = 0;

io.on('connection', function(socket){
    console.log('a user connected');
    
    socket.on('login', function(obj){
        socket.name = obj.userid;//将新加入用户的唯一标识当作socket的名称，后面退出的时候会用到
        if(!onlineUsers.hasOwnProperty(obj.userid)) {
            onlineUsers[obj.userid] = obj.username;
            onlineCount++;//在线人数+1
        }
        io.emit('login', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});//向所有客户端广播用户加入
        console.log(obj.username+'加入了聊天室');
    });
     
    
    socket.on('disconnect', function(){//监听用户退出
        if(onlineUsers.hasOwnProperty(socket.name)) {//将退出的用户从在线列表中删除
            var obj = {userid:socket.name, username:onlineUsers[socket.name]};
            delete onlineUsers[socket.name];//删除
            onlineCount--;//在线人数-1

            io.emit('logout', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});//向所有客户端广播用户退出
            console.log(obj.username+'退出了聊天室');
        }
    });

    socket.on('message', function(obj){//监听用户发布聊天内容
        io.emit('message', obj);//向所有客户端广播发布的消息
        console.log(obj.username+'说：'+obj.content);
    });

});

/*
  var socket = io('http://localhost');
  socket.on('news', function (data) {
      var token = data.token;
      socket.emit('chrX1', { my: 'data' });
  });
  
  
  io.on('connection', function (socket) {
  socket.emit('start', { hello: 'welcome', token: '123' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
*/