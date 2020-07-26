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
        newsystemMessageE.innerText = msgContent;
        msgObjE.appendChild(newsystemMessageE);
        scrollToBottom();
    };
    
    exportResult.updataOnlineUsersInfo = function(allOnlineUsers){
        var onlineUserNames = allOnlineUsers.map(function(value){
            return value.username;
        })
        var userListText = onlineUserNames.join('、');
        var onlineUserCount = onlineUserNames.length;
        onlinecountE.innerText = '当前共有 '+onlineUserCount+' 人在线，在线列表：'+ userListText;
    };
    
    exportResult.addMsg = function(userName, content, isMe){
        var msgTplE = document.getElementById("messageTpl");
        var msgE = msgTplE.cloneNode(true);
        msgE.children[0].innerText = userName;
        msgE.children[1].innerText = content;
        msgE.className = isMe? 'user': 'service';
        msgObjE.appendChild(msgE);
        scrollToBottom(); 
    };
    exportResult.showBaseInfo = function(username){
        showusernameE.innerText = username;
        msgObjE.style.minHeight = (screenheight - document.body.clientHeight + msgObjE.clientHeight) + "px";
        scrollToBottom();
    }
    return exportResult;
}