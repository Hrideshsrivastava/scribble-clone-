import React, { useEffect, useRef, useState } from 'react';
import ChatApp from './ChatApp';
import { io } from 'socket.io-client';

// Connect to backend WebSocket server
const socket = io('http://localhost:5000'); // Change if your backend is hosted elsewhere

function ScribbleGame() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    ctx.lineCap = 'round';
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'black';

    // Listen for drawing data from other users
    socket.on('draw', ({ x, y }) => {
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    });

    return () => {
      socket.off('draw');
    };
  }, []);

  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    const ctx = canvasRef.current.getContext('2d');

    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const ctx = canvasRef.current.getContext('2d');

    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);

    // Emit draw event
    socket.emit('draw', { x: offsetX, y: offsetY });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
  };

  return (
    <div className="game-card">
      <h2>Live Drawing Board 🎨</h2>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{ border: '2px solid #000', backgroundColor: '#fff' }}
      />
    </div>
  );
}

function App() {
  
  const [selectedGame, setSelectedGame] = useState('Scribble');

  const renderGameComponent = () => {
    switch (selectedGame) {
      case 'Scribble':
        return <ScribbleGame />;
      default:
        return <ScribbleGame />;
    }
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <nav className="game-navbar">
        <button
          onClick={() => setSelectedGame('Scribble')}
          className={selectedGame === 'Scribble' ? 'active' : ''}
        >
          Scribble
        </button>
      </nav>

      {/* Main Content */}
      <div className="content-area">
        <div className="chat-pane">
          <ChatApp />
        </div>

        <main className="game-pane">
          <div className="game-content-area">
            {renderGameComponent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
