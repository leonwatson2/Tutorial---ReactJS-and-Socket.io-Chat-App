import React, {Component} from 'react';
import io from 'socket.io-client';
import LoginForm from './LoginForm'
import ChatContainer from './chats/ChatContainer'
import {USER_CONNECTED,LOGOUT} from '../Events'
const socketUrl = "localhost:3231";

export default class Layout extends Component {
    constructor(props) {
        super(props);

        this.state = {
            socket:null,
            user:null
        };
        // this.socket = io('localhost:8080');

    }

    componentWillMount() {
        this.initSocket()
    }

    /**
     * Connect and initializes the socket
     */

    /**
     * Sets the user prop   in state
     * @param user
     */
    setUser = (user) => {
        const {socket} =this.state;
        socket.emit(USER_CONNECTED,user);
        this.setState({user});
    };

    /**
     * set the user prop to null when logout
     */

    logout = () => {
        const {socket} =this.state;
        socket.emit(LOGOUT);
        this.setState({user:null})
                
        
    };
    
    
    initSocket = ()=>{
        const socket = io(socketUrl);
        socket.on('connect', ()=>{
            console.log('Connected');
        });
        this.setState({socket})
    };

    render() {
        const {socket,user} = this.state;
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

