import React, { Component } from 'react';
import { VERIFY_USER } from '../Events'
import { facebookAppId as appId } from '../config'
import FacebookLogin from 'react-facebook-login'

export default class LoginForm extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	nickname:"",
	  	error:""
	  };
	}

	setUser = ({user, isUser})=>{

		if(isUser){
			this.setError("User name taken")
		}else{
			this.setError("")
			this.props.setUser(user)
		}
	}
	verifyUserIsNotLoggedIn = () => {
		const { socket } = this.props
		const { nickname } = this.state		
		socket.emit(VERIFY_USER, nickname, this.setUser)
	}
	
	handleSubmit = (e)=>{
		e.preventDefault()
		this.verifyUserIsNotLoggedIn()
	}

	handleChange = (e)=>{
		this.setState({nickname:e.target.value})
	}

	setError = (error)=>{
		this.setState({error})
	}

	render() {	
		const { nickname, error } = this.state
		return (
			<div className="login">
				<form onSubmit={this.handleSubmit} className="login-form" >

					<label htmlFor="nickname">
						<h2>Got a nickname?</h2>
					</label>
					<input
						ref={(input)=>{ this.textInput = input }} 
						type="text"
						id="nickname"
						value={nickname}
						onChange={this.handleChange}
						placeholder={'MYCoolUSername'}
						/>
							<FacebookLogin
					appId={appId}
					autoLoad={false}
					fields="name,picture"
					onClick={ ()=>{  } }
					callback={ (res)=>{ this.setState({nickname:res.name}); this.verifyUserIsNotLoggedIn()} } />,
						<div className="error">{error ? error:null}</div>

				</form>
			</div>
		);
	}
}
