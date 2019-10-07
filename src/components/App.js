import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import '../styles/App.css';
import $ from 'jquery';

const SERVER = 'https://chat-app-server-jeff.herokuapp.com/';

function ChatApp(props) {

  function getName() {
    let newName = prompt('What should we call you?', 'NewUser');
    if (newName == null || newName == '' || newName == 'NewUser') {
      return `NewUser ${Math.floor(Math.random() * 10)}`
    } else {
      return newName;
    }
  }

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
  // useEffect(() => {
  //   console.log("userList ran", refUserArr.current);
  //   setUserList(refUserArr.current.map((username) => {
  //     console.log("username ", username)
  //     return <li>{username}</li>
  //   }))
  // })




  useEffect(() => {
    var socket = io(SERVER);

    socket.emit('user connected', refUsername.current); //on connect, send message to server with username
    socket.on('user connected', function (userArr) {
      setUserList(userArr.map((username, i) => {
        console.log("username ", username)
        return <li key={`user-${i}`}>{username}</li>
      }))
    });

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
        <ul id="user-list" className="user-list">
          <p className="user-header">Who's connected?</p>
          {userList}
        </ul>
      </div>
      <ul id="messages">
        
      </ul>
      <div id="typing-messsage"></div>
      <form action="">
        <input id="m" autoComplete="off" />
        <button>Send</button>
      </form>
    </div>
  )

}

export default ChatApp;