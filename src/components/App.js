import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import '../styles/App.css';
import $ from 'jquery';

const SERVER = 'https://chat-app-server-jeff.herokuapp.com/';

function ChatApp(props) {

  const [username, setUsername] = useState(`NewUser ${Math.floor(Math.random() * 10)}`);
  let refUsername = useRef(username);
  useEffect(() => {
    refUsername.current = username;
  });
  const handleNameChange = (event) => {
    console.log('changing name to ', event.target.value);
    setUsername(event.target.value);
  }

  useEffect(() => {
    var socket = io(SERVER);
    $('form').submit(function (e) {
      e.preventDefault(); // prevents page reloading
      socket.emit('chat message', refUsername.current + ": " + $('#m').val()); // on form submit, emit meesage
      $('#messages').append($('<li>').text("You: " + $('#m').val())); //when I send message, append with 'you:'
      $('#m').val(''); // reset message field to blank 
      return false;
    });
    $('#m').focus(function (e) {
      $('#typing-messsage').append($('<p>').text("Someone is typing..."))
    }) //on focus add message
    socket.on('chat message', function (msg) {
      $('#messages').append($('<li>').text(msg));
    }); //on receving a message, append it
  }, []);

  return (
    <div>
      <ul id="messages"></ul>
      <div id="typing-messsage"></div>
      <form id="name-form" action="">
        <input type="text" name="name" value={username} onChange={(event) => handleNameChange(event)} autoComplete="off" />
      </form>
      <form action="">
        <input id="m" autoComplete="off" />
        <button>Send</button>
      </form>
    </div>
  )

}

export default ChatApp;