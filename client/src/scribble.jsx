import React, { useEffect, useRef, useState } from 'react';
import socket from './Socket';

function ScribbleGame() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000'); // default pen color
  const [thickness, setThickness] = useState(2); // default brush size
  const [isEraser, setIsEraser] = useState(false); // pen or eraser mode

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    ctx.lineCap = 'round';

    // Listen for drawing data from other users
    socket.on('draw', ({ x, y, isNewStroke, color, thickness }) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;

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
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    return () => {
      socket.off('draw');
      socket.off('clear-canvas');
    };
  }, []);

  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    const ctx = canvasRef.current.getContext('2d');

    ctx.strokeStyle = isEraser ? '#ffffff' : color;
    ctx.lineWidth = thickness;

    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    setIsDrawing(true);

    socket.emit('draw', {
      x: offsetX,
      y: offsetY,
      isNewStroke: true,
      color: isEraser ? '#ffffff' : color,
      thickness,
    });
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const ctx = canvasRef.current.getContext('2d');

    ctx.strokeStyle = isEraser ? '#ffffff' : color;
    ctx.lineWidth = thickness;

    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);

    socket.emit('draw', {
      x: offsetX,
      y: offsetY,
      isNewStroke: false,
      color: isEraser ? '#ffffff' : color,
      thickness,
    });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit('clear-canvas');
  };

  return (
    <div
  style={{
    height: '90vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '5px',
    topmargin: '10px',
    boxSizing: 'border-box',
    overflow: 'hidden',
  }}
>
  

  {/* Toolbar */}
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '20px',
      flexWrap: 'wrap',
      marginTop: '15px',
    }}
  >
    <label>
      Pen Color:
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        disabled={isEraser}
        style={{ marginLeft: '5px', cursor: isEraser ? 'not-allowed' : 'pointer' }}
      />
    </label>

    <label style={{ display: 'flex', alignItems: 'center' ,height: '4vh'}}>
      Brush Size:
      <input
        type="range"
        min="1"
        max="20"
        value={thickness}
        onChange={(e) => setThickness(Number(e.target.value))}
        style={{ marginLeft: '10px' ,height: '4vh'}}
      />
      <span style={{ marginLeft: '5px' }}>{thickness}px</span>
    </label>

    <button
      onClick={() => setIsEraser(!isEraser)}
      style={{
        backgroundColor: isEraser ? '#4caf50' : '#f44336',
        color: 'white',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        height: '4vh',
      }}
    >
      {isEraser ? 'Switch to Pen' : 'Switch to Eraser'}
    </button>
  </div>

  {/* Canvas Wrapper */}
  <div
    style={{
      flexGrow: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      maxHeight: '70vh',
    }}
  >
    {/* <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      width={window.innerWidth * 0.8}
      height={window.innerHeight * 0.6}
      style={{
        border: '2px solid #000',
        backgroundColor: '#fff',
        maxWidth: '100%',
        height: '100%',
        maxHeight: '100%',
        cursor: 'crosshair',
      }}
    /> */}
    <canvas
         ref={canvasRef}
         onMouseDown={startDrawing}
         onMouseMove={draw}
         onMouseUp={stopDrawing}
         onMouseLeave={stopDrawing}
         style={{ border: '2px solid #000', backgroundColor: '#fff' }}
      />
  </div>

  {/* Clear Button */}
  <button
    onClick={clearCanvas}
    style={{
      marginTop: '10px',
      padding: '8px 16px',
      backgroundColor: '#ff9800',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      height: '4vh'

    }}
  >
    Clear
  </button>
</div>

  );
}

export default ScribbleGame;
