import React, { useEffect, useRef, useState } from 'react';
import socket from './Socket';
import { use } from 'react';
import './index.css';

function ScribbleGame() {
  const clickSound = new Audio('./mouse-click.mp3');
  const cleanSound = new Audio('./swoosh.mp3');
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000'); // default pen color
  const [thickness, setThickness] = useState(2); // default brush size
  const [isEraser, setIsEraser] = useState(false); // pen or eraser mode
  // State to hold the word received from the server
  // This will be used to display the word to the drawer
  const [word, setWord] = useState('');
  const handleword = (data) => {
    setWord(data);
    console.log('Received word:', data);
  };


  useEffect(() => {

    socket.on('your-word', handleword );

  }, []);

  // Check if the current user is the drawer
  // This will be used to enable/disable drawing features
const [isDrawer, setIsDrawer] = useState(false);

useEffect(() => {
  socket.on('current-drawer', (drawerId) => {
    setIsDrawer(drawerId === socket.id); // true if you are the drawer
  });

  return () => {
    socket.off('current-drawer');
  };
}, []);


// Initialize the canvas and set up event listeners
  // This will handle drawing on the canvas and syncing with other users
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
      cleanSound.play();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    return () => {
      socket.off('draw');
      socket.off('clear-canvas');
    };
  }, []);

  const startDrawing = (e) => {
    if (!isDrawer) return; // ⛔ Block non-drawers
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
    if (!isDrawer) return;
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
  <div
    style={{
      flexGrow: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      maxHeight: '70vh',
      maxWidth: '70vw',
    }}
    className='canvas-container'
  >
    
    <canvas
         ref={canvasRef}
         onMouseDown={startDrawing}
         onMouseMove={draw}
         onMouseUp={stopDrawing}
         onMouseLeave={stopDrawing}
         style={{ border: '2px solid #000', backgroundColor: '#fff' }}
      />
  </div>

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
      onClick={() =>{ 
        setIsEraser(!isEraser);
        clickSound.play();


      }}
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

    <button
    onClick={()=>{
      clearCanvas();
      clickSound.play();

    }}
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
  
</div>

  );
}

export default ScribbleGame;
