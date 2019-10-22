import React from 'react';
import '../styles/App.css';
import closeIcon from '../images/close.png';

function PrivateMessage(props) {
  

  return (
    <div className='pm-box' id={`pm-box-${props.recipient}`}>
      <div className="pm-header">
        <p className="recipient-username">{props.recipient}</p>
        <div className="pm-close-container">
          <img className='pm-close-icon' src={closeIcon} onClick={() => props.closeBox(props.recipient)} />
        </div>
      </div>
      <ul className='messages' id={`private-messages-${props.recipient}`}>
      </ul>
      <div id="typing-private-messsage"></div>
      <form id={`private-message-form-${props.recipient}`} className="pm-message-form" action="">
        <input className="pm-message" id={`pm-${props.recipient}`} autoComplete="off" />
        <button className="pm-button" id={`pm-button-${props.recipient}`} data-recipient={props.recipient}>Send</button>
      </form>
    </div>
  )

}

export default PrivateMessage;