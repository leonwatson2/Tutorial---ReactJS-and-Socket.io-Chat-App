import React, { Component } from 'react';
import FAChevronDown from 'react-icons/lib/md/keyboard-arrow-down'
import FAMenu from 'react-icons/lib/fa/list-ul'
import FASearch from 'react-icons/lib/fa/search'
import MdEject from 'react-icons/lib/md/eject'

export default class SideBar extends Component{
		
	render(){
		const { chats, activeChat, user, setActiveChat, logout} = this.props
		return (
			<div id="side-bar">
					<div className="heading">
						<div className="app-name">Our Cool Chat <FAChevronDown /></div>
						<div className="menu">
							<FAMenu />
						</div>
					</div>
					<div className="search">
						<i className="search-icon"><FASearch /></i>
						<input placeholder="Search" type="text"/>
						<div className="plus"></div>
					</div>
					<div 
						className="users" 
						ref='users' 
						onClick={(e)=>{ (e.target === this.refs.user) && setActiveChat(null) }}>
						
						{
						chats.map((chat)=>{
							if(chat.name){
								const lastMessage = chat.messages[chat.messages.length - 1];
								const user = chat.users.find(({name})=>{
									return name !== this.props.name
								}) || { name:"Community" }
								const classNames = (activeChat && activeChat.id === chat.id) ? 'active' : ''
								
								return(
								<div 
									key={chat.id} 
									className={`user ${classNames}`}
									onClick={ ()=>{ setActiveChat(chat) } }
									>
									<div className="user-photo">{user.name[0].toUpperCase()}</div>
									<div className="user-info">
										<div className="name">{user.name}</div>
										{lastMessage && <div className="last-message">{lastMessage.message}</div>}
									</div>
									
								</div>
							)
							}

							return null
						})	
						}
						
					</div>
					<div className="current-user">
						<span>{user.name}</span>
						<div onClick={()=>{logout()}} title="Logout" className="logout">
							<MdEject/>	
						</div>
					</div>
			</div>
		);
	
	}
}
