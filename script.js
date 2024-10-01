const cells = document.querySelectorAll(".cell");
const gameStatus = document.getElementById("game-status");
const restartBtn = document.getElementById("restart-btn");
const choiceModal = document.getElementById("choice-modal");
const chooseXBtn = document.getElementById("choose-x");
const chooseOBtn = document.getElementById("choose-o");
const gameBoard = document.getElementById("game-board");

let playerMarker = "X"; // Default marker for player
let aiMarker = "O"; // Default marker for AI
let currentPlayer = ""; // Tracks whose turn it is
let board = ["", "", "", "", "", "", "", "", ""]; // Initial empty board
let isGameActive = true; // Game is active by default

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Function to start the game with player's choice
function startGame(playerChoice) {
  playerMarker = playerChoice;
  aiMarker = playerMarker === "X" ? "O" : "X"; // AI takes the opposite marker
  currentPlayer = playerMarker; // Player always starts the game
  isGameActive = true;
  gameStatus.textContent = "";
  board = ["", "", "", "", "", "", "", "", ""]; // Reset the board

  // Hide the choice modal and show the game board
  choiceModal.style.display = "none";
  gameBoard.style.display = "grid";
}

// Function to handle user clicks
function handleCellClick(event) {
  const clickedCell = event.target;
  const cellIndex = clickedCell.getAttribute("data-index");

  if (
    board[cellIndex] !== "" ||
    !isGameActive ||
    currentPlayer !== playerMarker
  ) {
    return;
  }

  // Player's turn
  updateCell(clickedCell, cellIndex, playerMarker);
  checkWinner();

  // AI plays if the game is still active
  if (isGameActive) {
    setTimeout(aiMove, 500); // AI waits for 500ms before making a move
  }
}

// AI move (randomly selects an empty cell)
function aiMove() {
  let emptyCells = [];

  // Find all empty cells
  board.forEach((cell, index) => {
    if (cell === "") {
      emptyCells.push(index);
    }
  });

  // If there are no empty cells, the game is a draw
  if (emptyCells.length === 0) {
    return;
  }

  // AI picks a random empty cell
  const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const aiCell = document.querySelector(`.cell[data-index='${randomIndex}']`);

  // AI plays
  updateCell(aiCell, randomIndex, aiMarker);
  checkWinner();
}

// Update the board and display the player's or AI's move
function updateCell(clickedCell, cellIndex, player) {
  board[cellIndex] = player;
  clickedCell.textContent = player;
}

// Check if there is a winner
function checkWinner() {
  let roundWon = false;

  // Check for all winning conditions
  for (let i = 0; i < winningConditions.length; i++) {
    const winCondition = winningConditions[i];
    const a = board[winCondition[0]];
    const b = board[winCondition[1]];
    const c = board[winCondition[2]];

    if (a === "" || b === "" || c === "") {
      continue;
    }

    if (a === b && b === c) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    gameStatus.textContent = `Player ${currentPlayer} wins!`;
    isGameActive = false;
    return;
  }

  if (!board.includes("")) {
    gameStatus.textContent = "It's a draw!";
    isGameActive = false;
    return;
  }

  // Switch turns
  currentPlayer = currentPlayer === playerMarker ? aiMarker : playerMarker;
}

// Restart the game
function restartGame() {
  currentPlayer = playerMarker; // Reset to player
  board = ["", "", "", "", "", "", "", "", ""]; // Reset board
  isGameActive = true; // Reactivate the game
  gameStatus.textContent = ""; // Clear status message
  cells.forEach((cell) => (cell.textContent = "")); // Clear the board display
}

// Event listeners for player choice
chooseXBtn.addEventListener("click", () => startGame("X"));
chooseOBtn.addEventListener("click", () => startGame("O"));

// Attach event listeners to cells and restart button
cells.forEach((cell) => cell.addEventListener("click", handleCellClick));
restartBtn.addEventListener("click", restartGame);
