import { getRandomWord } from './utils/words.js';

let players = [];
let currentDrawerIndex = 0;
let currentWord = '';
let gameStarted = false;
let maxpoints = 0 // Assuming each player can score 10 points per round
let scoredThisRound = new Set();

let roundTimeout = null;  // 🔁 used to cancel the timeout


let gameCondition = 0;

export function setGameCondition(value) {
  gameCondition = value;
}
export function getGameCondition() {
  return gameCondition;
}

export function getPlayers() {
  return players;
}

export function addPlayer(player) {
  players.push(player);
}

export function removePlayer(id) {
  players = players.filter(p => p.id !== id);

  if (players.length === 0) {
    gameStarted = false;
    currentDrawerIndex = 0;
    currentWord = '';
    clearTimeout(roundTimeout);  // 🧹 Cancel leftover timer
    roundTimeout = null;
    return;
  }

  if (currentDrawerIndex >= players.length) {
    currentDrawerIndex = 0;
  }
}

export function getHostId() {
  return players[0]?.id || null;
}

export function startGame(io) {
  if (players.length < 2) return;

  // Avoid duplicate timers
  if (!gameStarted) {
  currentDrawerIndex = 0;
}
  if (roundTimeout) {
    clearTimeout(roundTimeout);
    roundTimeout = null;
  }

  if (currentDrawerIndex >= players.length) {
    currentDrawerIndex = 0;
  }

  const drawer = players[currentDrawerIndex];
  if (!drawer) {
    console.warn("No drawer found. Aborting startGame.");
    return;
  }

  setGameCondition(1);

  setTimeout(() => io.emit('start-clock'), 5000);

  roundTimeout = setTimeout(() => {
    io.emit('stop-clock');
    nextTurn(io);
  }, 65000);

  maxpoints = players.length * 10;
  gameStarted = true;
  currentWord = getRandomWord();
  scoredThisRound.clear();

  scoredThisRound.add(drawer.id);

  io.emit('correct-word', currentWord);
  io.emit('current-drawer', drawer.id);

  io.emit('round-started', {
    drawerId: drawer.id,
    drawerName: drawer.name,
  });
}



export function nextTurn(io) {
  currentDrawerIndex = (currentDrawerIndex + 1) % players.length;
  
  io.emit('clear-canvas'); // ✅ no socket needed anymore
  startGame(io);
}


export function handleGuess(socket, io, guess) {
  if (!gameStarted || !currentWord) return;
   // ❌ Ignore guesses from the current drawer
  const drawerId = players[currentDrawerIndex]?.id;
  if (socket.id === drawerId) {
    socket.emit('guess-acknowledged', {
      avatar: '',
      text: "🎨 You're the drawer! No points for guessing.",
    });
    return;
  }

  if (guess.toLowerCase().trim() === currentWord.toLowerCase()) {

    // 🔒 Has this user already scored?
    if (scoredThisRound.has(socket.id)) {
          socket.emit('guess-acknowledged', {
          avatar: '',
          text: '✔️ Already scored, nice try!',
          senderId:''
        });

      return;
    }

    // ✅ Give points
    const playerIndex = players.findIndex(p => p.id === socket.id);
    if (playerIndex !== -1) {
      players[playerIndex].score += maxpoints;
      maxpoints -= 10;
      scoredThisRound.add(socket.id); // ✅ block future scoring for this round
      }

      

    io.emit('correct-guess', {
      playerId: socket.id,
      name: players[playerIndex]?.name,
      word: currentWord,
    });

    io.emit('player-list', [...players]); // update scores

    if (players.length == scoredThisRound.size){
      clearTimeout(roundTimeout);
      io.emit('stop-clock');
      setGameCondition(0);
      nextTurn(io);
      

    }
    
  }
}
