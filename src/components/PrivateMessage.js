import React from 'react';
import '../styles/App.css';

function PrivateMessage(props) {

  return (
    <div className='pm-box' id={`pm-box-${props.recipient}`}>
      <p className="recipient-username">{props.recipient}</p>
      <ul id={`private-messages-${props.recipient}`}>
      </ul>
      <div id="typing-private-messsage"></div>
      <form id={`private-message-form-${props.recipient}`} className="pm-message-form" action="">
        <input className="pm-message" id={`pm-${props.recipient}`} autoComplete="off" />
        <button className="pm-button" id={`pm-button-${props.recipient}`}>Send</button>
      </form>
    </div>
  )

}

export default PrivateMessage;