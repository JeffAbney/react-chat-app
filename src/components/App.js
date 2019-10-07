import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import '../styles/App.css';
import $ from 'jquery';

const SERVER = 'https://chat-app-server-jeff.herokuapp.com/';

function ChatApp(props) {
  let newName = prompt('What should we call you?', `NewUser ${Math.floor(Math.random() * 10)}`);
  const [username, setUsername] = useState(newName);
  let refUsername = useRef(username);
  useEffect(() => {
    refUsername.current = username;
  });

  useEffect(() => {
    var socket = io(SERVER);
    $('form').submit(function (e) {
      e.preventDefault(); // prevents page reloading
      socket.emit('chat message', refUsername.current + ": " + $('#m').val()); // on form submit, emit meesage
      $('#messages').append($('<li>').text("You: " + $('#m').val())); //when I send message, append with 'you:'
      $('#m').val(''); // reset message field to blank 
      return false;
    });
    socket.on('chat message', function (msg) {
      $('#messages').append($('<li>').text(msg));
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
        <ul className="user-list">
          <p className="user-header">Who's connected?</p>
        </ul>
      </div>
      <ul id="messages"></ul>
      <div id="typing-messsage"></div>
      <form action="">
        <input id="m" autoComplete="off" />
        <button>Send</button>
      </form>
    </div>
  )

}

export default ChatApp;