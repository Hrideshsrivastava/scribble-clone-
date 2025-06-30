import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Make sure this matches your frontend port
    methods: ['GET', 'POST'],
  },
});

let players = []; // Store players as { id, name, score }

io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  socket.on('login', ({ username, password }) => {
    // Here you would handle authentication logic
    // For now, we just emit a success message
    if (username && password) {
      socket.emit('login-success');
    } else {
      socket.emit('login-error', 'Invalid credentials');
    }
  });

  // 🧑 Handle player joining
  socket.on('player-join', (username) => {
    const player = { id: socket.id, name: username, score: 0 };
    players.push(player);
    console.log('Players:', players);

    io.emit('player-list', players); // Notify everyone
  });

  // 💬 Chat handler
  socket.on('chat-message', (msg) => {
    io.emit('chat-message', msg);
  });

  // 🎨 Drawing handler
  socket.on('draw', (data) => {
    socket.broadcast.emit('draw', data); // Don't send back to sender
  });

  // ❌ Handle disconnect
  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
    players = players.filter((p) => p.id !== socket.id);
    io.emit('player-list', players);
  });

  socket.on('clear-canvas', () => {
    socket.broadcast.emit('clear-canvas'); // Notify others to clear their canvas
  });
});

server.listen(5000, () => {
  console.log('🚀 Server running at http://localhost:5000');
});
