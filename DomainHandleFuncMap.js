




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