import React, { Component } from 'react';
import FAChevronDown from 'react-icons/lib/md/keyboard-arrow-down'
import FAMenu from 'react-icons/lib/fa/list-ul'
import FASearch from 'react-icons/lib/fa/search'
import MdEject from 'react-icons/lib/md/eject'
import { SideBarOption } from './SideBarOption'
import { last, get, differenceBy } from 'lodash'
import { createChatNameFromUsers } from '../../Factories'
import PropTypes from 'prop-types'

export default class SideBar extends Component{
	static propTypes = {
		onSendPrivateMessage: PropTypes.func.isRequired,
		user:PropTypes.object.isRequired, 
		setActiveChat:PropTypes.func.isRequired, 
		logout:PropTypes.func.isRequired, 
		chats:PropTypes.arrayOf(PropTypes.object).isRequired, 
		activeChat:PropTypes.object, 
		users:PropTypes.arrayOf(PropTypes.object).isRequired
	}
	static type = {
		USERS:"users",
		CHATS:"chats"
	}
	constructor(props){
		super(props)
		this.state = {
			reciever:"",
			activeSideBar: SideBar.type.CHATS
		}
	}
	handleSubmit = (e) => {
		e.preventDefault()
		const { reciever } = this.state
		const { onSendPrivateMessage } = this.props

		onSendPrivateMessage(reciever)
		this.setState({reciever:""})
	}
	setActiveSideBar = (activeSideBar) =>{
		if(activeSideBar !== this.state.activeSideBar)
			this.setState({ activeSideBar })
	}

	addChatForUser(reciever){
		this.props.onSendPrivateMessage(reciever)
		this.setActiveSideBar(SideBar.type.CHATS)
	}

	render(){
		const { user, setActiveChat, logout, chats, activeChat, users } = this.props
		const { reciever, activeSideBar } = this.state
		return (
			<div id="side-bar">
					<div className="heading">
						<div className="app-name">Our Cool Chat <FAChevronDown /></div>
						<div className="menu">
							<FAMenu />
						</div>
					</div>
					<form onSubmit={this.handleSubmit} className="search">
						<i className="search-icon"><FASearch /></i>
						<input 
							placeholder="Search" 
							type="text"
							value={reciever}
							onChange={(e)=>{ this.setState({ reciever:e.target.value }) }}/>
						<div className="plus"></div>
					</form>
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
					<div 
						className="users" 
						ref='users' 
						onClick={(e)=>{ (e.target === this.refs.user) && setActiveChat(null) }}>
						
						{
						activeSideBar === SideBar.type.CHATS ? 
						chats.map((chat)=>{
							return(
								<SideBarOption 
									key = { chat.id }
									lastMessage = { get(last(chat.messages), 'message', '') }
									name = { chat.isCommunity ? chat.name : createChatNameFromUsers(chat.users, user.name) }
									active = { activeChat.id === chat.id }
									onClick = { ()=>{ this.props.setActiveChat(chat) } }
									/>
							)
					}) 
					: differenceBy(users, [user], 'id').map((otherUser)=>{
							return(
								<SideBarOption
									key = { otherUser.id }
									name = { otherUser.name }
									onClick = { () => { this.addChatForUser(otherUser.name) } }
								/>
							)
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
