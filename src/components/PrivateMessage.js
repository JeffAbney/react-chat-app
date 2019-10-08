import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import '../styles/App.css';
import $ from 'jquery';

function PrivateMessage(props) {


  return (
    <div>
      <p className="recipient-username">BillTheDude</p>
      <ul id="private-messages">
      </ul>
      <div id="typing-private-messsage"></div>
      <form id="private-message-form" className="pm-message-form" action="">
        <input className="pm-message" id="pm" autoComplete="off" />
        <button className="pm-button">Send</button>
      </form>
    </div>
  )

}

export default PrivateMessage;