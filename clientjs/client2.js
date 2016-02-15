"use strict";

function getChatObj(username, uiHander){        
    //var socket = io.connect('ws://zxchat.applinzi.com'); //连接websocket后端服务器
    var ws = new WebSocket('ws://localhost:5050/chat1'); 
    var userid = new Date().getTime()+""+Math.floor(Math.random()*899+100);
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
        }else if(msgObj.type == 'refreshUserList'){
            if(msgObj.newUser.userid === userid){//新进入的用户是自己
                uiHander.updataOnlineUsersInfo(msgObj.content);
            }else{
                uiHander.showSystemMsg(msgObj.newUser.username + "进入房间");
                uiHander.updataOnlineUsersInfo(msgObj.content);
            }
        }else if(msgObj.type == 'chatMessage'){
            uiHander.addMsg(msgObj.content, msgObj.from, false);
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
                        uiHander.addMsg(msgContent, username, true);
                    },
        logout:     function(){
                        ws.close();
                    }
    }
    return chatObj;
}
