import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

export class SideBarOption extends PureComponent{
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
  shouldComponentUpdate(nextProps) {
    return(this.props.lastMessage !== nextProps.lastMessage 
      || this.props.name !== nextProps.name 
      || this.props.active !== nextProps.active)
  }
  render(){
    const { active, lastMessage, name, onClick } = this.props 

    return (
      <div  
      className={`user ${active ? 'active' : ''}`}
      onClick={ (e)=>{ onClick(e) } }
      >
      <div className="user-photo">{ name[0].toUpperCase() }</div>
      <div className="user-info">
        <div className="name">{ name }</div>
        {lastMessage && <div className="last-message">{lastMessage}</div>}
      </div>
      
    </div>
    )
  }
}

