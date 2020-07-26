"use strict";

var sampleChatRoomE = document.getElementById("sampleChatRoom");
var createChatRoomE = document.getElementById("createChatRoom");

function enterAChatRoom(username, chatRoomName){
    if(username != ""){
        document.getElementById("chatRoomSelect").style.display = 'none';
        document.getElementById("chatbox").style.display = 'block';
        document.getElementById('chatRoomName').innerText = chatRoomName;
        startChat(chatRoomName, username);
    }
    return false;
}

var createANewChatRoom = function(chatRoomName){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/addChatRoom/" + encodeURIComponent(chatRoomName), true);
    xhr.send();
    
    var newChatRoomE = sampleChatRoomE.cloneNode(true);
    sampleChatRoomE.id = encodeURIComponent(chatRoomName) + "ChatRoom";
    
    var titleE = newChatRoomE.getElementsByTagName("h2")[0];
    titleE.innerText = chatRoomName;
    sampleChatRoomE.parentElement.insertBefore(newChatRoomE, createChatRoomE);
    bindEventForChatRoom(newChatRoomE);
}

var bindEventForChatRoom = function(chatRoomE){
    var titleE = chatRoomE.getElementsByTagName("h2")[0];
    var textE = chatRoomE.getElementsByTagName("input")[0];
    var buttomE = chatRoomE.getElementsByTagName("button")[0];
    buttomE.onclick = function(){
        enterAChatRoom(textE.value, titleE.innerText);
    }
    textE.onkeydown = function(ev) {//通过“回车”提交用户名
        if (ev.keyCode === 13) {
            enterAChatRoom(textE.value, titleE.innerText);
        }
    };
};



;(function (){
    bindEventForChatRoom(sampleChatRoomE);
    var textE = createChatRoomE.getElementsByTagName("input")[0];
    var buttomE = createChatRoomE.getElementsByTagName("button")[0];
    buttomE.onclick = function(){
        createANewChatRoom(textE.value)
    }
    textE.onkeydown = function(ev) {//通过“回车”提交用户名
        if (ev.keyCode === 13) {
            createANewChatRoom(textE.value);
        }
    };
})();
    


