# Adding users to chat and updating name
### Events.js
1. Add NEW_CHAT_USER constant to Event.js
### ChatContainer.js
2. Create addUserToChat and removeUsersFromChats methods
```js
addUserToChat = ({chatId, newUser})=>{
	const { chats } = this.state
	const newChats = chats.map(chat => {
		if(chat.id === chatId)
			return Object.assign({}, chat, { users: [...chat.users, newUser] })
		return chat
	})
	this.setState({ chats:newChats })		
}
removeUsersFromChat = (removedUsers)=>{
	const { chats } = this.state
	const newChats = chats.map(chat => {
		let newUsers = difference(chat.users, removedUsers.map(u=>u.name))
		return Object.assign({}, chat , { users:newUsers })
	})
	this.setState({ chats:newChats })	
}
```
3. Add NEW_CHAT_USER event function
- import NEW_CHAT_USER constant
```js
socket.on(NEW_CHAT_USER, this.addUserToChat)
``` 

4. Update USER_DISCONNECT event function
- import differenceBy from lodash
```js
socket.on(USER_DISCONNECTED, (users)=>{
    const removedUsers = differenceBy(this.state.users, values(users), 'id')

    this.removeUsersFromChat(removedUsers)
    this.setState({ users:values(users) })
})
```
5. Update ComponentWillUnmountFunction
```js
socket.off(NEW_CHAT_USER)
```
### SocketManager.js
6. import NEW_CHAT_USER constant
7. update PRIVATE_MESSAGE event
```js
//Send New User Name to other users to update chat
}else{
    if(!(reciever in activeChat.users)){
        activeChat.users
            .filter( user => user in connectedUsers )
            .map( user => connectedUsers[user] )
            .map( user => {
                socket.to(user.socketId)
                .emit(NEW_CHAT_USER, { chatId:activeChat.id, newUser: reciever })
            })
            socket.emit(NEW_CHAT_USER, { chatId:activeChat.id, newUser: reciever })									      
    }
    socket.to(recieverSocket).emit(PRIVATE_MESSAGE, activeChat)
}
```