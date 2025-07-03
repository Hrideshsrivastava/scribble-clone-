// ChatApp.jsx

import socket from './Socket'; // match your backend URL
import React, { useEffect, useRef, useState } from 'react';

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);

  const [user, setUser] = useState({ id: "", name: "", avatar: "", score: 0 });
  const[correctWord, setCorrectWord] = useState("");

  useEffect(() => {
    socket.on('chat-message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    //store the cirrect word locally
    // this will be used to check if the user has guessed the word correctly
    const handleCorrectWord = (word) => {
      console.log("📝 Correct word received:", word);
      setCorrectWord(word);
    };
    socket.on('correct-word', handleCorrectWord);
     


    const handlePlayerInfo = (player) => {
      console.log("👤 Player info received:", player);
      setUser(player);
      

    };
    socket.emit('request-player-info');
    
    socket.on("player-info", handlePlayerInfo)

     
    

    

    return () => {
      socket.off('chat-message');
      socket.off('player-info');
    };
  }, []);


  useEffect(() => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }
}, [messages]);


  
  const sendMessage = (e) => {
  e.preventDefault();
  if (messageInput.trim()) {
    const messagePayload = {
      avatar: user.avatar,
      text: messageInput,
    };
    socket.emit('chat-message', messagePayload);
    setMessageInput('');
  }
};

  return (
    <div style={{ padding: '10px', height: '70%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #ccc', padding: '8px', background: '#f9f9f9' }}>
        {messages.map((msg, index) => {
      let color = '#000'; // default text color

      // 🌈 Customize colors based on your logic
      if (msg.text === correctWord) {
        color = 'green';
        msg.text = '✅ correct word' ; // prepend a checkmark to the correct word
      }

       else if (msg.senderId === socket.id) {
        color = 'red'; // your own messages
      }

      return (
        <div key={index} style={{ marginBottom: '4px', color }}>
          {msg.avatar} {msg.text}
        </div>
      );
    })}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} style={{ display: 'flex', marginTop: '8px' }}>
        <input
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          style={{ flex: 1, padding: '6px' }}
          placeholder="Type your message..."
        />
        <button type="submit" style={{ marginLeft: '5px' }}>Send</button>
      </form>
    </div>
  );
}

export default ChatApp;