import { getRandomWord } from './utils/words.js';

let players = [];
let currentDrawerIndex = 0;
let currentWord = '';
let gameStarted = false;
let maxpoints = 0 // Assuming each player can score 10 points per round

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

  maxpoints = players.length * 10;
  gameStarted = true;
  currentWord = getRandomWord();

  const drawer = players[currentDrawerIndex];

  // ✅ Send full word to ALL clients
  io.emit('correct-word', currentWord);

  // ✅ Tell clients who the drawer is
  io.emit('current-drawer', drawer.id);

  io.emit('round-started', {
    drawerId: drawer.id,
    drawerName: drawer.name,
  });

  setTimeout(() => io.emit('start-clock'), 5000);
  setTimeout(() => nextTurn(io), 65000);
}


export function nextTurn(io) {
  currentDrawerIndex = (currentDrawerIndex + 1) % players.length;
  startGame(io); // ✅ no socket needed anymore
}


export function handleGuess(socket, io, guess) {
  if (!gameStarted || !currentWord) return;

  if (guess.toLowerCase().trim() === currentWord.toLowerCase()) {
    const playerIndex = players.findIndex(p => p.id === socket.id);
    if (playerIndex !== -1) {
      // Update score immutably
      players[playerIndex] = {
        ...players[playerIndex],
        score: players[playerIndex].score + maxpoints
      };
      maxpoints -= 10;
    }

    io.emit('correct-guess', {
      playerId: socket.id,
      name: players[playerIndex]?.name,
      word: currentWord,
    });

    // 🔁 Broadcast updated player list with new array reference
    io.emit('player-list', [...players]);

    
  }
}