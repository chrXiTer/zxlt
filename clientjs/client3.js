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
