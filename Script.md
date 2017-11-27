# Before Record 
1. add comments
  a. Factories.js
```
/*
*	createChat
*	Creates a Chat object
* 	@prop id {string}
* 	@prop name {string}
* 	@prop messages {Array.Message}
* 	@prop users {Array.string}
*		@prop typingUsers {Array.string}
*		@prop isCommunity {boolean}
*	@param {object} 
*		messages {Array.Message}
*		name {string}
*		users {Array.string}
* 
*/

/*
* createChatNameFromUsers
* @param users {Array.string} 
* @param excludedUser {string} user to exclude from list of names
* @return {string} users names concatenated by a '&' or "Empty Chat" if no users
*/
```
# Adding User List

1. We're going to get the list of users from the backend and display it to the user.

2. Move the SideBar.js into a it's own folder since we're going to make components that will be inside this component.

3. Extract chat options into a component SideBarOption
4. import PropTypes from 'prop-types'
5. Set the prop types
```
static propTypes = {
  name: PropTypes.string.isRequired,
  lastMessage: PropTypes.string,
  active: PropTypes.bool,
  onClick: PropTypes.func
}
static defaultProps = {
  lastMessage: "",
  active: false,
  onClick: () => {  }
}
```
6. render method

```js
  const { active, lastMessage, name, onClick } = this.props 
```
```html
 <div  
  className={`user ${active ? 'active' : ''}`}
  onClick={ onClick } }
  >
  <div className="user-photo">{ name[0].toUpperCase() }</div>
  <div className="user-info">
    <div className="name">{ name }</div>
    {lastMessage && <div className="last-message">{lastMessage}</div>}
  </div>
</div>
```
### SideBar.js
7. Use that inside SideBar.js
8. Install/Import methods from lodash the functional javascript library
```
npm install --save lodash

import { last, get } from 'lodash'
```
9. Use the SideBarOption in render method
```jsx
chats.map((chat)=>{
	return(
		<SideBarOption 
			key = { chat.id }
			lastMessage = { get(last(chat.messages), 'message', '') }
			name = { chat.isCommunity ? chat.name : createChatNameFromUsers(chat, user.name) }
			active = { activeChat.id === chat.id }
			onClick = { ()=>{ this.props.setActiveChat(chat) } }
			/>
	)
})
```
### Factories.js
8. Update createChat method to use isCommunity and createChatNameFromUsers
```js
const createChat = ({messages = [], name, users = [], isCommunity = false} = {})=>(
	{
		id: uuidv4(),
		name: isCommunity ? "Community" : createChatNameFromUsers(users),
		messages,
		users,
		typingUsers:[],
		isCommunity
	}
)

const createChatNameFromUsers = (users, excludedUser = "")=>{
	return users.filter(u => u !== excludedUser).join(' & ') || "Empty Chat"
}

module.exports = {
  createChatNameFromUsers
}
```

9. Check Application

### SideBarUsers
10. Create fake users 
```js
const fakeUsers = ["Michelle", "Jim", "Kelly"] 
```
11. import differenceBy
```
import { last, get, differenceBy } from 'lodash'
``` 
12. Map through users
```js
differenceBy(users, [user], 'id').map((otherUser)=>{
  return(
    <SideBarOption
      key = { otherUser.id }
      name = { otherUser.name }
      onClick = { () => { this.addChatForUser(otherUser.name) } }
    />
  )
})
```
	- Create addChatForUser() function 
```jsx
addChatForUser(reciever){
	this.props.onSendPrivateMessage(reciever)
}
```
13. Add Buttons to choose between chats and users list

```jsx

<div className="side-bar-select">
  <div onClick={ ()=>{ this.setActiveSideBar(SideBar.type.CHATS) }} 
        className={`side-bar-select__option 
                    ${(activeSideBar === SideBar.type.CHATS) ? 'active' : ''}`}>
    <span>Chats</span>
  </div>
  <div  onClick={ ()=>{ this.setActiveSideBar(SideBar.type.USERS) }} 
        className={`side-bar-select__option 
                    ${(activeSideBar === SideBar.type.USERS) ? 'active' : ''}`}>
    <span>Users</span>
  </div>
</div>
```
14. Create static types
```js
export default class SideBar extends Component{
	static type = {
		USERS:"users",
		CHATS:"chats"
	}
```
15. Add active side bar state
```js
this.state = {
			reciever:"",
			activeSideBar: SideBar.type.CHATS
		}
```
- Create activeSideBar method
```js
setActiveSideBar = (type) => {
	this.setState({ activeSideBar:type })
}
```
- Add conditional to output of lists
```js
activeSideBar === SideBar.type.CHATS ?
```
16. Check Application
### SocketManger.js
17. Connect to backend, already has USER_CONNECTED emit

### ChatContainer.js
18. Add event for on USER_CONNECTED, USER_DISCONNECTED
  - import USER_CONNECTED
  - update ` initSocket(socket){ `

```js
socket.on(USER_CONNECTED, (users)=>{
  this.setState({ users:values(users) })
})
socket.on(USER_DISCONNECTED, (users)=>{
  const removedUsers = differenceBy(this.state.users, values(users), 'id')
  
  this.removeUsersFromChat(removedUsers)
  this.setState({ users:values(users) })
})
```
19. Unsubscribe to these events, 
  - The state isn't being updated when user logs out and component unmounts
```js
componentWillUnmount(){
		const { socket } = this.props
		socket.off(PRIVATE_MESSAGE)
		socket.off(USER_DISCONNECTED)
		socket.off(USER_CONNECTED)
	}
```
22. Add users to the default state
```js
this.state = {
	chats:[],
	activeChat:null,
	users:[]
}
```
23. get users from state and pass in `users` to the SideBar
```
const { chats, activeChat, users } = this.state
<SideBar
	logout={logout}
	chats={chats}
	user={user}
	users={users}
	activeChat={activeChat}
	setActiveChat={this.setActiveChat}
	onSendPrivateMessage={this.sendOpenPrivateMessage}
	/>
```
### SideBar.js
24. Change fakeUsers to the users
25. Check Application
