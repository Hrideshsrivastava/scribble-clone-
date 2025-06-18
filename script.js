const canvas = document.getElementById("drawing-board");
const ctx = canvas.getContext("2d");

const colorPicker = document.getElementById("colorPicker");
const toolbar = document.getElementById("toolbar");

let drawing = false;
let currentTool = "pen";
let penColor = "#333333";

// Show canvas and toolbar
function startGame() {
  canvas.style.display = "block";
  toolbar.style.display = "block";
}

// Handle tool switching
function setMode(mode) {
  currentTool = mode;
}

// Clear canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Update pen color
colorPicker.addEventListener("change", (e) => {
  penColor = e.target.value;
});

// Start drawing
canvas.addEventListener("mousedown", () => {
  drawing = true;
  ctx.beginPath();
});

// Stop drawing
canvas.addEventListener("mouseup", () => {
  drawing = false;
});

canvas.addEventListener("mouseout", () => {
  drawing = false;
});

// Draw on move
canvas.addEventListener("mousemove", (e) => {
  if (!drawing) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ctx.lineWidth = 4;
  ctx.lineCap = "round";

  if (currentTool === "eraser") {
    ctx.strokeStyle = "white";
  } else {
    ctx.strokeStyle = penColor;
  }

  ctx.lineTo(x, y);
  ctx.stroke();
});
