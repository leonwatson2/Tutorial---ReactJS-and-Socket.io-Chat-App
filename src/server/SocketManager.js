const io = require('./index.js').io;
const {VERIFY_USER,USER_CONNECTED,LOGOUT,USER_DISCONNECTED,COMMUNITY_CHAT,MESSAGE_SENT,MESSAGE_RECEIVED,TYPING} = require('../Events');
const {createUser, createMessage,createChat} = require('../Factories');

let connectedUsers={ };
let communityChat = createChat();

module.exports=function (socket) {
   console.log("socket Id: "+ socket.id);

    let sendMessageToChatFromUser;
    let sendTypingFromUser;

    //Verify username
    socket.on(VERIFY_USER, (nickname,callback) => {
      if(isUser(connectedUsers,nickname)){
         callback({isUser:true,user:null })
      }else{
         callback({isUser:false, user:createUser({name:nickname})})
      }
    });

    //User connects with a username

    socket.on(USER_CONNECTED,(user) => {
       connectedUsers = addUser(connectedUsers,user);
       socket.user = user;
       sendMessageToChatFromUser = sendMessageToChat(user.name);
        sendTypingFromUser = sendTypingToChat(user.name);

       io.emit(USER_CONNECTED,connectedUsers);
       console.log(connectedUsers)

    });

    //user disconects
    socket.on('disconnect', ()=>{
        if("user" in socket){
            connectedUsers = removeUser(connectedUsers, socket.user.name);

            io.emit(USER_DISCONNECTED, connectedUsers)
            console.log("Disconnect"+connectedUsers);
        }

    })

    //user logout
    socket.on(LOGOUT, ()=>{
        connectedUsers = removeUser(connectedUsers, socket.user.name);
        io.emit(USER_DISCONNECTED, connectedUsers);
        console.log("Disconnect",connectedUsers);
    });

    // send community chat
    socket.on(COMMUNITY_CHAT, (callback)=>{
        callback(communityChat)
    });

    //user sends message
    socket.on(MESSAGE_SENT, ({chatId, message})=>{
        sendMessageToChatFromUser(chatId, message)
    })

    //add user to typing users on chatId
    socket.on(TYPING, function({chatId, isTyping}){

        sendTypingFromUser(chatId, isTyping)
    })
};


function sendMessageToChat(sender){
    return (chatId, message) => {
        io.emit(`${MESSAGE_RECEIVED}-${chatId}`, createMessage({message, sender}))
    }
}

function sendTypingToChat(user){

    return (chatId, isTyping)=>
    {
        io.emit(`${TYPING}-${chatId}`, {user, isTyping})
    }
}


function addUser(userList,user) {
    let newList= Object.assign({},userList);
    newList[user.name] = user ;
    return newList

}

function removeUser(userList, username) {
   let newList= Object.assign({},userList);
    delete newList[username];
    return newList
}

function isUser(userList, username) {
    return username in userList
}