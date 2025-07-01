// ChatApp.jsx
import React, { useEffect, useState } from 'react';
import socket from './Socket'; // match your backend URL

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  const [user, setUser] = useState({ id: "", name: "", avatar: "", score: 0 });


  useEffect(() => {
    socket.on('chat-message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });


    const handlePlayerInfo = (player) => {
      console.log("👤 Player info received:", player);
      setUser(player);
      console.log("👤 Player info received:", user);

    };
    socket.emit('request-player-info');
    
    socket.on("player-info", handlePlayerInfo)

     
    

    

    return () => {
      socket.off('chat-message');
      socket.off('player-info');
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim()) {
      socket.emit('chat-message', messageInput);
      setMessageInput('');
    }
  };

  return (
    <div style={{ padding: '10px', height: '70%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #ccc', padding: '8px', background: '#f9f9f9' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: '4px' }}>{msg}</div>
        ))}
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