import React, { useState, useEffect } from "react";
import socket from './Socket';

function Scoreboard() {
  const [players, setPlayers] = useState([]);
  const [hostId, setHostId] = useState(null);
  const [drawerId,setDrawerId] = useState(null)
   const correctSound = new Audio('./correct.mp3');
  useEffect(() => {
    const handlePlayerList = (updatedPlayers) => {
      console.log("📋 Updated player list received:", updatedPlayers);
      // Sort players by score in descending order
      setHostId(updatedPlayers[0]?.id || null); // Set hostId to the first player in the list
      setPlayers(updatedPlayers.sort((a, b) => b.score - a.score));
    };

    socket.on('correct-guess', ()=>{correctSound.play()})

    socket.on("player-list", handlePlayerList);
    socket.emit("request-player-list");



    return () => {
      socket.off("player-list", handlePlayerList);
    };
  }, []);

  useEffect(()=>{

    const handleDrawer = (drawerId) => {
      console.log("🧑‍🎨 Current drawer ID:", drawerId);
      setDrawerId(drawerId);
    };

    socket.on('current-drawer', handleDrawer);

    return () => {
      socket.off('current-drawer', handleDrawer);
    };
  })

  // --- Style Objects for Cleaner JSX ---

  const scoreboardContainerStyle = {
    padding: '10px',
    height: '25vh',
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

  const listItemStyle = (index,player_id) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0px 15px',
    borderRadius: '8px',
    backgroundColor: player_id === hostId ?  '#dfd32aff':'#fff',
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
              style={listItemStyle(index,player.id)}
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
                {hostId === player.id && <span style={{ color: 'gold' }}>👑</span>}
                {drawerId === player.id && <span style={{ color: 'gold' }}>🖌️</span>}
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
