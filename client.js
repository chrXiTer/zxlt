;(function (io) {
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
                userListText = userListText + onlineUsers[key] + "、";
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
    
    function getSocketHandler(userid, username, UIHander) {
        var socket = io.connect('ws://zxchat.applinzi.com'); //连接websocket后端服务器
        //var socket = io.connect('ws://localhost:5050'); //连接websocket后端服务器
        socket.emit('login', {userid:userid, username:username});//告诉服务器端有用户登录
        socket.on('login', function(obj){//监听新用户登录
            var systemMsgContent = obj.user.username + "加入了聊天室";
            UIHander.updataOnlineUsersInfo(obj.onlineUsers);
            UIHander.showSystemMsg(systemMsgContent); 
        });
        socket.on('logout', function(obj){//监听用户退出
            var systemMsgContent = obj.user.username + "退出了聊天室";
            UIHander.updataOnlineUsersInfo(obj.onlineUsers);
            UIHander.showSystemMsg(systemMsgContent); 
        });   
        socket.on('message', function(obj){//监听消息发送
            var isMe = (obj.userid == userid);
            UIHander.addMsg(obj.username, obj.content, isMe);
        });
        return socket;
    }
    
    function getChatObj(username, uiHander){
        var chatObj = {};
        chatObj.sendMsg = function(msgContent){
            var obj = {
                    userid: chatObj.userid,
                    username: chatObj.username,
                    content: msgContent
                };
            chatObj.socket.emit('message', obj);
        },
        chatObj.logout = function(){
            chatObj.socket.disconnect();
        },
        chatObj.userid = new Date().getTime()+""+Math.floor(Math.random()*899+100);
        chatObj.username = username;
        chatObj.socket = getSocketHandler(chatObj.userid, chatObj.username, uiHander);
        return chatObj;
    }

    (function(){
        var chatObj;
        //第一个界面用户提交用户名,进入聊天室
        var usernameSubmit = function(){
            var username = document.getElementById("username").value;
            if(username != ""){
                document.getElementById("username").value = '';
                document.getElementById("loginbox").style.display = 'none';
                document.getElementById("chatbox").style.display = 'block';
                var uiHander = getUIHander();
                chatObj = getChatObj(username, uiHander);
            }
            return false;
        }

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
        document.getElementById("usernameSubmit").onclick = usernameSubmit;
        document.getElementById("username").onkeydown = function(ev) {//通过“回车”提交用户名
            if (ev.keyCode === 13) {
                usernameSubmit();
            }
        };
        document.getElementById("mjr_send").onclick = submit;
        document.getElementById("content").onkeydown = function(ev) {//通过“回车”提交信息
            if (ev.keyCode === 13) {
                submit();
            }
        }
    })();
})(io);