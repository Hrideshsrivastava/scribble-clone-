import socket from './Socket'; // match your backend URL
import React, { useEffect, useRef, useState } from 'react';

function ChatApp() {
  const clickSound = new Audio('./mouse-click.mp3');
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);

  const [user, setUser] = useState({ id: "", name: "", avatar: "", score: 0 });
  const [correctWord, setCorrectWord] = useState("");
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  useEffect(() => {
    socket.on('guess-acknowledged', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    socket.on('chat-message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    
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
    socket.on("player-info", handlePlayerInfo);

    return () => {
      socket.off('chat-message');
      socket.off('player-info');
      socket.off('correct-word');
      socket.off('guess-acknowledged');
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
        name: user.name, // Include the user's name
        text: messageInput,
        senderId: socket.id,
      };
      socket.emit('chat-message', messagePayload);
      setMessageInput('');
    }
  };

  // --- Style Objects for Cleaner JSX ---

  const chatContainerStyle = {
    height: '70%',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Arial, sans-serif',
    padding: '10px',
    boxSizing: 'border-box',
  };

  const messagesAreaStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    background: '#f0f2f5',
  };

  const formStyle = {
    display: 'flex',
    padding: '10px',
    background: '#ffffff',
    borderTop: '1px solid #ddd',
  };

  const inputStyle = {
    flex: 1,
    padding: '12px',
    border: '1px solid #ccc',
    borderRadius: '20px',
    marginRight: '10px',
    fontSize: '14px',
    outline: 'none',
  };

  const buttonStyle = {
    padding: '12px 20px',
    border: 'none',
    borderRadius: '20px',
    background: isButtonHovered ? '#0056b3' : '#007bff',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.2s ease',
  };

  const messageBubbleWrapper = (isOwn) => ({
    display: 'flex',
    justifyContent: isOwn ? 'flex-end' : 'flex-start',
  });

  const messageBubble = (isOwn, isCorrectGuess) => ({
    maxWidth: '70%',
    padding: '10px 15px',
    borderRadius: '18px',
    background: isCorrectGuess 
      ? 'linear-gradient(to right, #28a745, #218838)' 
      : isOwn 
        ? 'linear-gradient(to right, #007bff, #0056b3)' 
        : '#e4e6eb',
    color: isOwn || isCorrectGuess ? 'white' : 'black',
    borderBottomLeftRadius: isOwn ? '18px' : '4px',
    borderBottomRightRadius: isOwn ? '4px' : '18px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  });
  
  const systemMessageStyle = {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#6c757d',
    fontSize: '12px',
  };

  const messageHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    fontWeight: 'bold',
    marginBottom: '4px',
    color: '#6c757d',
  };

  return (
    <div style={chatContainerStyle}>
      <div style={messagesAreaStyle}>
        {messages.map((msg, index) => {
          const isSystemMessage = !msg.senderId;
          const isCorrectGuess = msg.text === correctWord && !isSystemMessage;
          const isOwnMessage = msg.senderId === socket.id;

          if (isSystemMessage) {
            return <div key={index} style={systemMessageStyle}>{msg.text}</div>;
          }

          return (
            <div key={index} style={messageBubbleWrapper(isOwnMessage)}>
              <div style={messageBubble(isOwnMessage, isCorrectGuess)}>
                {!isOwnMessage && (
                  <div style={{...messageHeaderStyle, color: isCorrectGuess ? '#c3e6cb' : '#6c757d'}}>
                    <span>{msg.avatar}</span>
                    <span>{msg.name}</span>
                  </div>
                )}
                <div>{isCorrectGuess ? 'Guessed the word!' : msg.text}</div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} style={formStyle}>
        <input
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          style={inputStyle}
          placeholder="Type your guess..."
        />
        <button 
          type="submit" 
          onClick={() => { clickSound.play(); }}
          style={buttonStyle}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatApp;