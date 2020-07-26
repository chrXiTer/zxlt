"use strict";

function getChatObj(chatRoomName, username, uiHander){        
    //var socket = io.connect('ws://zxchat.applinzi.com'); //连接websocket后端服务器
    //var ws = new WebSocket('ws://localhost:5050/' + chatRoomName); 
    var ws = new WebSocket('ws://zxlt.applinzi.com/' + chatRoomName); 
    var userid = new Date().getTime()+""+Math.floor(Math.random()*899+100);
    var allOnlineUsers = [];
    var allOnLineUsersObj = {};
    ws.onopen = function(){
        var enterMsg = JSON.stringify({
            type:"login",
            userid:userid, 
            username:username
        });
        ws.send(enterMsg); 
    }; 
    ws.onmessage = function(evt){
        var msg = evt.data;
        var msgObj = JSON.parse(msg);
        if(msgObj.type === 'system'){
            uiHander.showSystemMsg(msgObj.content);
        }else if(msgObj.type === 'userEnter' || msgObj.type === 'userLeave'){//有新用户加入或离开房间时,更新数据，提示并刷新用户显示列表。
            allOnlineUsers = msgObj.allOnlineUsers;
            allOnlineUsers.map(function(value){
                allOnLineUsersObj[value.userid] = value.username;
            });
            if(msgObj.user.userid !== userid){//新进入的用户不是自己，需要进行提示
                var tipsText = (msgObj.type === 'userEnter')? '进入房间':'离开房间';
                uiHander.showSystemMsg(msgObj.user.username + tipsText);
            }
            uiHander.updataOnlineUsersInfo(allOnlineUsers); //刷新用户显示列表
        }else if(msgObj.type == 'chatMessage'){
            var msgFromUserName = allOnLineUsersObj[msgObj.from];
            uiHander.addMsg(msgFromUserName, msgObj.content, false);
        }
    }; 
    ws.onclose = function(evt){console.log('WebSocketClosed!');}; 
    ws.onerror = function(evt){console.log('WebSocketError!');}; 
    var chatObj = {
        sendMsg:    function(msgContent){
                        var msgObj = {
                                type:"chat",
                                userid: userid,
                                username: username,
                                content: msgContent
                            };
                        var msgStr = JSON.stringify(msgObj);
                        ws.send(msgStr);
                        uiHander.addMsg(username, msgContent, true);
                    },
        logout:     function(){
                        ws.close();
                    }
    }
    return chatObj;
}

function startChat(chatRoomName, username){
    var uiHander = getUIHander();
    var chatObj = getChatObj(chatRoomName, username, uiHander);
    
    var submit = function(){ //在聊天室提交聊天消息内容
        var content = document.getElementById("content").value;
        if(content != ''){
            chatObj.sendMsg(content);
            document.getElementById("content").value = '';
        }
        return false;
    }
    var logout = function(){ //退出，本例只是一个简单的刷新
        chatObj.logout();
        location.reload();
    }

    document.getElementById("logout").onclick = logout;
    document.getElementById("mjr_send").onclick = submit;
    document.getElementById("content").onkeydown = function(ev) {//通过“回车”提交信息
        if (ev.keyCode === 13) {
            submit();
        }
    };
};
