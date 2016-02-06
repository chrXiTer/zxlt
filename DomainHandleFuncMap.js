
var HandleFuncRoom = {
        "ChatRoom.Main":ChatRoomHandleFunc,
};

var ChatRoomHandleFunc = function(io, message){
        var messageType = message.messageType;
        if(messageType === "enter"){
            message.content = "enter";
        }else if(messageType === "leave"){
            message.content = "leave"; 
        }else if(messageType === "content"){
            ;
        }else{
            ;
        }
        io.emit("ChatRoom.Main",message);
}


socket.on('login', function(obj){
    socket.name = obj.userid;//将新加入用户的唯一标识当作socket的名称，后面退出的时候会用到
    if(!onlineUsers.hasOwnProperty(obj.userid)) {
        onlineUsers[obj.userid] = obj.username;
        onlineCount++;//在线人数+1
    }
    io.emit('login', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});//向所有客户端广播用户加入
    console.log(obj.username+'加入了聊天室');
});