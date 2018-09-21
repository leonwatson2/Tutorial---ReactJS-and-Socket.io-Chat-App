import React, { Component } from 'react';
import FAVideo from 'react-icons/lib/fa/video-camera'
import FAUserPlus from 'react-icons/lib/fa/user-plus'
import MdEllipsisMenu from 'react-icons/lib/md/keyboard-control'

export default class ChatHeading extends Component {
    render() {
        const { name, online, numberOfUsers } = this.props
        const onlineText = online ? 'online':'offline'
        return (
            <div className="chat-header">
                <div className="user-info">
                    <div className="user-name">{name}</div>
                    <div className="status">
                        <div className={`indicator ${onlineText}`}></div>
                        <span>{numberOfUsers ? numberOfUsers : null} online</span>
                    </div>
                </div>
                <div className="options">
                    <FAVideo />
                    <FAUserPlus />
                    <MdEllipsisMenu />
                </div>
            </div>
        );
    }
}