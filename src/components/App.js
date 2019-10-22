"use strict";
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import '../styles/App.css';
import $ from 'jquery';
import PrivateMessage from './PrivateMessage.js'

//  const SERVER = 'https://chat-app-server-jeff.herokuapp.com/';
const SERVER = 'http://localhost:3000/';

function ChatApp(props) {

  function getName() {
    let newName = prompt('What should we call you?', 'NewUser');
    if (newName == null || newName == '' || newName == 'NewUser') {
      let randomNum = Math.floor(Math.random() * 50000);
      return `NewUser${randomNum}`
    } else {
      return newName;
    }
  }

  const [pmArr, setPmArr] = useState([]);
  let refPmArr = useRef(pmArr);
  useEffect(() => {
    refPmArr.current = pmArr;
  });


  const [pmMessages, setPmMessages] = useState({});
  let refPmMessages = useRef(pmMessages);
  useEffect(() => {
    refPmMessages.current = pmMessages;
  });

  const [privateMessageBoxes, setPrivateMessageBoxes] = useState([]);
  useEffect(() => {
    setPrivateMessageBoxes(function () {
      console.log('setting pms');
      console.log('messages in this thread ', pmMessages)
      return pmArr.map((recipient) => <PrivateMessage key={`${recipient}-pm`} recipient={recipient} closeBox={removePmBox}/>)
    })
  }, [pmArr, pmMessages]);



  const [username, setUsername] = useState(getName);
  let refUsername = useRef(username);
  useEffect(() => {
    refUsername.current = username;
  });

  const [userArr, setuserArr] = useState([]);
  let refUserArr = useRef(userArr);
  useEffect(() => {
    refUserArr.current = userArr;
  });

  const [userList, setUserList] = useState();

  function addPmBox(partner) {
    if (refPmArr.current.indexOf(partner) < 0) {
      setPmArr(() => [...refPmArr.current, partner]);
    } else {
      $(`#pm-${partner}`).focus();
    }
  }

  useEffect( () => {
    console.log("trying to focus ", `#pm-${pmArr[pmArr.length-1]}`);
    $(`#pm-${pmArr[pmArr.length-1]}`).focus();
  }, [privateMessageBoxes])

  function removePmBox(partner) {
    let newArr = [...pmArr];
    newArr.splice(pmArr.indexOf(partner), 1)
    setPmArr(newArr);
  }

  useEffect(() => {
    var socket = io(SERVER);

    socket.emit('user connected', refUsername.current); //on connect, send message to server with username
    socket.on('users changed', function (userArr) {
      setUserList(userArr.map((username, i) => {
        return <li
          key={`user-${i}`}
          onClick={() => {
            addPmBox(username);
          }}>
          {username}
        </li>
      }))
    });

    $('#chat-message-form').submit(function (e) {
      e.preventDefault(); // prevents page reloading
      socket.emit('chat message', refUsername.current + ": " + $('#m').val()); // on form submit, emit meesage
      $('#messages').append($('<li>').text("You: " + $('#m').val())); //when I send message, append with 'you:'
      $('#m').val(''); // reset message field to blank 
      return false;
    });

    socket.on('chat message', function (msg) {
      $('#messages').append($('<li>').text(msg));
    }); //on receving a message, append it


    // Add submit beahvior to each pm submit button with EVENT DELEGATION

    document.getElementById("pm-container").addEventListener("click", function (e) {
      if (e.target && e.target.nodeName == "BUTTON") {
        let sender = username;
        let recipient = event.target.getAttribute('data-recipient');
        e.preventDefault();
        socket.emit('private message', sender, recipient, sender + ": " + $(`#pm-${recipient}`).val());
        $(`#private-messages-${recipient}`).append($('<li>').text("You: " + $(`#pm-${recipient}`).val()));
        $(`#pm-${recipient}`).val(''); // reset message field to blank 
        return false;
      }
    });

    socket.on('private message', function (sender, msg) {
      console.log("recieving pm from ", sender);
      if (refPmArr.current.indexOf(sender) < 0) {
        console.log("New pm");
        addPmBox(sender);
        setPmMessages(Object.assign({}, pmMessages, {[sender]: "anything!"})); //this gives above line time to create element before
        $(`#private-messages-${sender}`).append($('<li>').text(msg)); //this line appends to that same element
      } else {
        $(`#private-messages-${sender}`).append($('<li>').text(msg));
      }
    }); //on receving a message, append it
    
    

    $('#m').focus(function (e) {
      socket.emit('focus on', refUsername.current);
    });
    socket.on("focus on", (function (username) {
      $('#typing-messsage').append($('<p>').text(`${username} is typing...`))
    })) //on focus add message

    $('#m').focusout(function (e) {
      socket.emit('focus out');
    });
    socket.on('focus out', (function (e) {
      $('#typing-messsage').replaceWith('<div id="typing-messsage"></div>');
    })) //on focusout remove message

  }, []);


  return (
    <div>
      <div className="user-container">
        <ul id="user-list" className="user-list">
          <p className="user-header">Who's connected?</p>
          {userList}
        </ul>
      </div>
      <ul className="messages" id="messages">
      </ul>
      <div id="typing-messsage"></div>
      <form id="chat-message-form" action="">
        <input id="m" autoComplete="off" />
        <button>Send</button>
      </form>
      <div className="private-message-container" id="pm-container">
        {privateMessageBoxes}
      </div>
    </div>
  )
}

export default ChatApp;