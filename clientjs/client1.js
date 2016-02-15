"use strict";

function getUIHander(){
    var screenheight = window.innerHeight ? window.innerHeight : dx.clientHeight;
    var showusernameE = document.getElementById("showusername");
    var onlinecountE = document.getElementById("onlinecount");
    var msgObjE = document.getElementById("chatboxMessage");
    var exportResult = {};
    
    function scrollToBottom(){ //让浏览器滚动条保持在最低部
        window.scrollTo(0, msgObjE.clientHeight);
    }
    
    exportResult.showSystemMsg = function(msgContent){//更新系统消息，比如提示有用户加入、退出聊天室             
        var systemMessageTplE = document.getElementById("systemMessageTpl");
        var newsystemMessageE = systemMessageTplE.cloneNode(false);
        newsystemMessageE.innerText = msgContent
        msgObjE.appendChild(newsystemMessageE);  
        scrollToBottom();
    };
    
    exportResult.updataOnlineUsersInfo = function(onlineUsers){
        var userListText = '';//更新在线人数及列表
        var onlineUserCount = 0
        for(var key in onlineUsers) {
            userListText = userListText + onlineUsers[key].username + "、";
            onlineUserCount = onlineUserCount + 1
        }
        onlinecountE.innerText = '当前共有 '+onlineUserCount+' 人在线，在线列表：'+ userListText.substr(0, userListText.length -1);
    };
    
    exportResult.addMsg = function(userName, content, isMe){
        var contentDiv = '<div>'+content+'</div>';
        var usernameDiv = '<span>'+userName+'</span>';
        var section = document.createElement('section');
        section.className = isMe? 'user': 'service';
        section.innerHTML = contentDiv + usernameDiv;
        msgObjE.appendChild(section);
        scrollToBottom(); 
    };
    exportResult.showBaseInfo = function(username){
        showusernameE.innerText = username;
        msgObjE.style.minHeight = (screenheight - document.body.clientHeight + msgObjE.clientHeight) + "px";
        scrollToBottom();
    }
    return exportResult;
}