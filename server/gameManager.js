import { getRandomWord } from './utils/words.js';

let players = [];
let currentDrawerIndex = 0;
let currentWord = '';
let gameStarted = false;

export function getPlayers() {
  return players;
}

export function addPlayer(player) {
  players.push(player);
}

export function removePlayer(id) {
  players = players.filter(p => p.id !== id);
  if (currentDrawerIndex >= players.length) currentDrawerIndex = 0;
}

export function getHostId() {
  return players[0]?.id || null;
}

export function startGame(io) {
  if (players.length < 2) return;

  gameStarted = true;
  currentWord = getRandomWord();
  const drawer = players[currentDrawerIndex];

  // Tell drawer the word privately
  io.to(drawer.id).emit('your-word', currentWord);
  io.emit("correct-word", currentWord); // Notify everyone of the word
  io.emit('start-clock');

  // Tell everyone else who the drawer is
  io.emit('round-started', {
    drawerId: drawer.id,
    drawerName: drawer.name,
  });

  setTimeout(() => nextTurn(io), 70000);
}


export function nextTurn(io) {
  currentDrawerIndex = (currentDrawerIndex + 1) % players.length;
  startGame(io); // reuse same logic
}

export function handleGuess(socket, io, guess) {
  if (!gameStarted || !currentWord) return;

  if (guess.toLowerCase().trim() === currentWord.toLowerCase()) {
    io.emit('correct-guess', {
      playerId: socket.id,
      name: players.find(p => p.id === socket.id)?.name,
      word: currentWord,
    });

     // move to next round
  }
}