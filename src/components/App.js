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

  function privateMessages(arr) {
    arr.map((recipient) => <PrivateMessage recipient={recipient} />)
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

  const [pmArr, setPmArr] = useState(["John", "Mike"]);


  useEffect(() => {
    var socket = io(SERVER);

    socket.emit('user connected', refUsername.current); //on connect, send message to server with username
    socket.on('users changed', function (userArr) {
      setUserList(userArr.map((username, i) => {
        return <li
          key={`user-${i}`}
          onClick={() => console.log(username)}>
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

    // Add submit beahvior to each pm submit button
    pmArr.map(
      (recipient) => {
        $(`#pm-button-${recipient}`).on('click',
          function (e) {
            let sender = username;
            console.log("sending private message from", sender);
            e.preventDefault(); // prevents page reloading
            socket.emit('private message', sender, recipient, sender + ": " + $(`#pm-${recipient}`).val());
            $(`#private-messages-${recipient}`).append($('<li>').text("You: " + $(`#pm-${recipient}`).val())); //when I send message, append with 'you:'
            $(`#pm-${recipient}`).val(''); // reset message field to blank 
            return false;
          }
        )
      }
    )

    socket.on('private message', function (sender, msg) {
      console.log("recieving pm");
      if (pmArr.indexOf(sender) !== 0) {
        setPmArr(pmArr.push(sender))
      };
      $(`#private-messages-${sender}`).append($('<li>').text(msg));
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
      <form id="chat-message-form" action="">
        <input id="m" autoComplete="off" />
        <button>Send</button>
      </form>
      <div className="private-message-container">
        <PrivateMessage recipient={"John"} onClick={(e) => submitPm(e, "John")} />
        <PrivateMessage recipient={"Mike"} />
      </div>
    </div>
  )
}

export default ChatApp;