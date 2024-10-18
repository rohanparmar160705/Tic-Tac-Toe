// Selects all elements with the class 'cell' (the game board squares) and stores them in the 'cells' variable
const cells = document.querySelectorAll('.cell');

// Selects the header element where the game status (winner or draw) will be displayed
const titleHeader = document.querySelector('#titleHeader');

// Selects the display elements for the X and O players
const xPlayerDisplay = document.querySelector('#xPlayerDisplay');
const oPlayerDisplay = document.querySelector('#oPlayerDisplay');

// Selects the restart button element to reset the game
const restartBtn = document.querySelector('#restartBtn');

// Initialize variables for the game
let player = 'X'; // The current player (X starts the game)
let isPauseGame = false; // Flag to pause the game during the computer's turn
let isGameStart = false; // Flag to indicate if the game has started

// Array representing the state of each cell in the game (initially empty)
const inputCells = ['', '', '', '', '', '', '', '', ''];

// Array of win conditions, defining the index combinations for winning (rows, columns, diagonals)
const winConditions = [
    [0, 1, 2], // First row
    [3, 4, 5], // Second row
    [6, 7, 8], // Third row
    [0, 3, 6], // First column
    [1, 4, 7], // Second column
    [2, 5, 8], // Third column
    [0, 4, 8], // First diagonal
    [2, 4, 6]  // Second diagonal
];

// Add click event listeners to each cell in the game board
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => tapCell(cell, index)); // Calls the tapCell function when a cell is clicked
});

// Function to handle cell taps by the player
function tapCell(cell, index) {
    // Ensure the clicked cell is empty and the game isn't paused
    if (cell.textContent == '' && !isPauseGame) {
        isGameStart = true; // Mark the game as started
        updateCell(cell, index); // Update the cell with the current player's mark

        // If there is no winner after the player's move
        if (!checkWinner()) {
            changePlayer(); // Change to the next player
            randomPick(); // Call the computer to make a random pick
        }
    }
}

// Function to update the cell with the player's mark and adjust the game state
function updateCell(cell, index) {
    cell.textContent = player; // Set the cell's text content to the current player's mark
    inputCells[index] = player; // Update the inputCells array to reflect the current player's move
    // Change the cell's text color based on the player
    cell.style.color = (player == 'X') ? '#1892EA' : '#A737FF';
}

// Function to switch the current player
function changePlayer() {
    // Toggle between 'X' and 'O'
    player = (player == 'X') ? 'O' : 'X';
}

// Function for the computer's random pick
function randomPick() {
    isPauseGame = true; // Pause the game for the computer's turn

    setTimeout(() => { // Delay the computer's move by 1 second to simulate thinking time
        let randomIndex; // Variable to store the randomly selected index
        do {
            // Pick a random index from the inputCells array
            randomIndex = Math.floor(Math.random() * inputCells.length);
        } while (inputCells[randomIndex] != ''); // Ensure the selected cell is empty

        // Update the cell with the computer's move
        updateCell(cells[randomIndex], randomIndex);
        // Check if the computer has won after its move
        if (!checkWinner()) {
            changePlayer(); // Change back to the human player
            // Allow human player to make a move again
            isPauseGame = false; 
            return;
        }
        // Toggle the player to switch back to the other player (X or O)
        player = (player == 'X') ? 'O' : 'X';
    }, 1000); // 1-second delay for the computer's move
}

// Function to check if there is a winner
function checkWinner() {
    // Loop through all win conditions
    for (const [a, b, c] of winConditions) {
        // Check if the current player has filled any of the win conditions
        if (inputCells[a] == player && inputCells[b] == player && inputCells[c] == player) {
            declareWinner([a, b, c]); // Declare the winner if found
            return true; // Return true to indicate a winner has been found
        }
    }

    // Check for a draw (if all cells are filled and no winner)
    if (inputCells.every(cell => cell != '')) {
        declareDraw(); // Declare a draw if no cells are empty
        return true; // Return true to indicate the game is over
    }
}

// Function to declare the winner and highlight winning cells
function declareWinner(winningIndices) {
    titleHeader.textContent = `${player} Win`; // Display the winning player's name in the title header
    isPauseGame = true; // Pause the game

    // Highlight the winning cells by changing their background color
    winningIndices.forEach((index) =>
        cells[index].style.background = '#2A2343'
    );

    restartBtn.style.visibility = 'visible'; // Show the Restart button
}

// Function to declare a draw
function declareDraw() {
    titleHeader.textContent = 'Draw!'; // Display "Draw!" in the title header
    isPauseGame = true; // Pause the game
    restartBtn.style.visibility = 'visible'; // Show the Restart button
}

// Function to allow players to choose their character (X or O) before the game starts
function choosePlayer(selectedPlayer) {
    // Ensure the game hasn't started yet
    if (!isGameStart) {
        player = selectedPlayer; // Set the player to the selected character (X or O)
        // Highlight the active player display based on the selected character
        if (player == 'X') {
            xPlayerDisplay.classList.add('player-active'); // Highlight X display
            oPlayerDisplay.classList.remove('player-active'); // Remove highlight from O display
        } else {
            xPlayerDisplay.classList.remove('player-active'); // Remove highlight from X display
            oPlayerDisplay.classList.add('player-active'); // Highlight O display
        }
    }
}

// Add an event listener to the restart button to reset the game
restartBtn.addEventListener('click', () => {
    restartBtn.style.visibility = 'hidden'; // Hide the Restart button
    inputCells.fill(''); // Reset the inputCells array to empty strings
    cells.forEach(cell => {
        cell.textContent = ''; // Clear the text content of each cell
        cell.style.background = ''; // Reset the background color of each cell
    });
    isPauseGame = false; // Allow the game to continue
    isGameStart = false; // Mark the game as not started
    titleHeader.textContent = 'Choose'; // Reset the title header to prompt player choice
});
