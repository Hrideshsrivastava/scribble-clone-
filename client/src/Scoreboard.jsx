import React, { useState, useEffect } from "react";
import socket from './Socket';

function Scoreboard() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const handlePlayerList = (updatedPlayers) => {
      console.log("📋 Updated player list received:", updatedPlayers);
      // Sort players by score in descending order
      setPlayers(updatedPlayers.sort((a, b) => b.score - a.score));
    };

    socket.on("player-list", handlePlayerList);
    socket.emit("request-player-list");

    return () => {
      socket.off("player-list", handlePlayerList);
    };
  }, []);

  // --- Style Objects for Cleaner JSX ---

  const scoreboardContainerStyle = {
    padding: '10px',
    height: '30%',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Arial, sans-serif',
  };

  const listWrapperStyle = {
    flex: 1,
    overflowY: 'auto',
    background: 'linear-gradient(to bottom, #ffffff, #f9f9f9)',
    borderRadius: '12px',
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
    padding: '16px',
  };

  const headerStyle = {
    textAlign: 'center',
    margin: '0 0 15px 0',
    color: '#333',
    fontSize: '22px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
  };

  const listStyle = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  };

  const listItemStyle = (index) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 15px',
    borderRadius: '8px',
    backgroundColor: index % 2 === 0 ? '#fff' : '#f1f3f5',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  });

  const playerInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '16px',
    fontWeight: '500',
  };
  
  const avatarStyle = {
    fontSize: '20px',
  };
  
  const scoreStyle = {
    fontWeight: 'bold',
    fontSize: '18px',
    color: '#007bff',
    background: '#e7f3ff',
    padding: '4px 10px',
    borderRadius: '20px',
  };


  return (
    <div style={scoreboardContainerStyle}>
      <div style={listWrapperStyle}>
        <h2 style={headerStyle}>Scoreboard</h2>
        <ul style={listStyle}>
          {players.map((player, index) => (
            <li 
              key={player.id} 
              style={listItemStyle(index)}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.08)';
              }}
            >
              <div style={playerInfoStyle}>
                <span style={avatarStyle}>{player.avatar}</span>
                <span>{player.name}</span>
              </div>
              <span style={scoreStyle}>{player.score}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Scoreboard;
