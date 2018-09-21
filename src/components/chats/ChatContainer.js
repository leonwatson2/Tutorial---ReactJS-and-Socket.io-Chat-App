import React, {Component} from 'react';
import SidBar from './SidBar'
import {COMMUNITY_CHAT,MESSAGE_RECEIVED,TYPING,MESSAGE_SENT} from '../../Events'
import Messages from '../messeging/Messages'
import MessageInput from '../messeging/MessageInput'
import ChatHeading from './ChatHeading'



class ChatContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chats: [],
            activeChat: null
        };
    }

    componentDidMount() {
        const { socket } = this.props;
        socket.emit(COMMUNITY_CHAT, this.resetChat)
    }

    resetChat = (chat) => {
        return this.addChat(chat,true)

    };

    addChat = (chat,reset) => {
        console.log(chat);
        const {socket} = this.props;
        const {chats} = this.state;

        const newChats = reset ? [chat] : [...chats,chat];
        this.setState({chats:newChats, activeChat:reset ?  chat: this.state.activeChat});

        const messageEvent =`${MESSAGE_RECEIVED}-${chat.id}`;
        const typingEvent =`${TYPING}-${chat.id}`;

        socket.on(typingEvent,this.updateTypingInChat(chat.id));
        socket.on(messageEvent,this.addMessageToChat(chat.id));

    };


    addMessageToChat(chatId){
        return message =>{
            const { chats } = this.state;
            let newChats = chats.map((chat) => {
                if(chat.id === chatId)
                    chat.messages.push(message);
                return chat;
            });
            this.setState({chats:newChats});

        }
    }

    updateTypingInChat(chatId){
        return ({isTyping, user}) =>{
            if(user !== this.props.user.name){

                const { chats } = this.state
                let newChats = chats.map((chat) => {
                    if(chat.id === chatId){
                        if(isTyping && !chat.typingUsers.includes(user))
                            chat.typingUsers.push(user)
                        else if(!isTyping && chat.typingUsers.includes(user))
                            chat.typingUsers = chat.typingUsers.filter(u => u !== user)
                    }
                    return chat;
                })
                this.setState({chats:newChats})
            }
        }
    }



    setActiveChat = (activeChat) => {
        this.setState({activeChat});

    };

    /*
	*	Adds a message to the specified chat
	*/
    sendMessage(chatId, message){
        const { socket } = this.props;
        socket.emit(MESSAGE_SENT, {chatId, message})
    }

    /*
    *	Sends typing status to server.
    */
    sendTyping(chatId, isTyping){

        const { socket } = this.props;
        socket.emit(TYPING, {chatId, isTyping})

    }


    render() {
        const {user,logout}=this.props;
        const {chats,activeChat} = this.state;
        return (
            <div className="container">
               <SidBar
                   logout={logout}
                   chats={chats}
                   user={user}
                   activeChat={activeChat}
                   setActiveChat={this.setActiveChat}

               />

                <div className="chat-room-container">
                    {
                        activeChat !== null ? (
                                <div className="chat-room">
                                    <ChatHeading
                                        name={activeChat.name}
                                        online={true} />
                                    <Messages
                                        messages={activeChat.messages}
                                        user={user}
                                        typingUsers={activeChat.typingUsers}/>

                                    <MessageInput
                                        sendMessage={
                                            (message)=>{
                                                this.sendMessage(activeChat.id, message)
                                            }
                                        }
                                        sendTyping={
                                            (isTyping)=>{
                                                this.sendTyping(activeChat.id, isTyping)
                                            }
                                        }
                                    />
                                </div>
                            )
                            :
                            <div className="chat-room choose">
                                <h3>Choose a chat</h3>
                            </div>
                    }
                </div>
            </div>
        );
    }
}

export default ChatContainer;