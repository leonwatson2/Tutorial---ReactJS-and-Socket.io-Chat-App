import React, { Component } from 'react';
import io from 'socket.io-client'
import { USER_CONNECTED, LOGOUT, VERIFY_USER } from '../Events'
import LoginForm from './LoginForm'
import ChatContainer from './chats/ChatContainer'
import { socketUrl } from '../config'
export default class Layout extends Component {
	
	constructor(props) {
	  super(props);
		
	  this.state = {
	  	socket:null,
	  	user:null
	  };
	}

	componentWillMount() {
		this.initSocket()
	}

	/*
	*	Connect to and initializes the socket.
	*/
	initSocket = ()=>{
		const socket = io(socketUrl)
		socket.on('connect', this.reInitialize)
		
		this.setState({socket})
	}
	reInitialize = ()=>{
		const { user, socket } = this.state
		if(user){
			socket.emit(VERIFY_USER, user.name, ({isUser, user})=>{ 
				if(isUser)
					this.setUser(null)
				else 
					this.setUser(user)
			})				
		}
	}

	/*
	* 	Sets the user property in state 
	*	@param user {id:number, name:string}
	*/	
	setUser = (user)=>{
		const { socket } = this.state
		socket.emit(USER_CONNECTED, user);
		this.setState({ user })
	}

	/*
	*	Sets the user property in state to null.
	*/
	logout = ()=>{
		const { socket } = this.state
		socket.emit(LOGOUT)
		this.setState({ user:null })

	}


	render() {
		const { socket, user } = this.state
		return (
			<div className="container">
				{
					!user ?	
					<LoginForm socket={socket} setUser={this.setUser} />
					:
					<ChatContainer socket={socket} user={user} logout={this.logout}/>
				}
			</div>
		);
	}
}
