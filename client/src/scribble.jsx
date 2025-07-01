import React, { useEffect, useRef, useState } from 'react';
import socket from './Socket';
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
    socket.on('draw', ({ x, y, isNewStroke }) => {
  if (isNewStroke) {
    ctx.beginPath();
    ctx.moveTo(x, y);
  } else {
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  }
});


    socket.on('clear-canvas', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
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

  // Emit the start of a new stroke
  socket.emit('draw', {
    x: offsetX,
    y: offsetY,
    isNewStroke: true
  });
};


 const draw = (e) => {
  if (!isDrawing) return;
  const { offsetX, offsetY } = e.nativeEvent;
  const ctx = canvasRef.current.getContext('2d');

  ctx.lineTo(offsetX, offsetY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(offsetX, offsetY);

  // Emit draw event and tell others if it's the start of a new stroke
  socket.emit('draw', {
    x: offsetX,
    y: offsetY,
    isNewStroke: false // This will always be false here
  });
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
      <button onClick={clearcanvas=>{
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        socket.emit('clear-canvas'); // Notify others to clear their canvas

      }
      
      
    }>clear</button>
      
    </div>
  );
}
export default ScribbleGame;