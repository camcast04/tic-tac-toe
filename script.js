/*----- constants -----*/

// 1) Define required constants:
// -> 1.1) Define a colors object with keys of 'null' (when the square is
const COLOR = { null: '#fff', 1: '#ff7268', '-1': '#93c1ed' };
// empty), and players 1 & -1. The value assigned to each key represents the
//color to display for an empty square (null), player 1 and player -1.
// -> 1.2) Define the 8 possible winning combinations, each containing
//three indexes of the board that make a winner if they hold the same
//player value.
const winningCombinations = [
  [0, 1, 2], // side-side
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6], // up - down
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8], // diagonal
  [2, 4, 6],
];

/*----- state variables -----*/

// 2) Define required variables used to track the state of the game:
// -> 2.1) Use a board array to represent the squares.
let board;
// -> 2.2) Use a turn variable to remember whose turn it is.
let turn;
// -> 2.3) Use a winner variable to represent three different possibilities
//         player that won, a tie, or game in play.
let winner;

/*----- cached elements  -----*/

// 3) Store elements on the page that will be accessed in code more than once
// in variables to make code more concise, readable and performant:
// -> 3.1) Store the 9 elements that represent the squares on the page.
const squares = document.querySelectorAll('#board div');
const h1 = document.querySelector('h1'); // message at the top
const resetBtn = document.getElementById('reset');
// 4) Upon loading the app should:
// -> 4.1) Initialize the state variables:
// -> ->  4.1.1) Initialize the board array to 9 nulls to represent empty
//        squares. The 9 elements will "map" to each square, where index 0
//        maps to the top-left square and index 8 maps to the bottom-right square.
// -> ->  4.1.2) Initialize whose turn it is to 1 (player 'X'). Player 'O' will be represented
//               by -1.
// -> ->  4.1.3) Initialize winner to null to represent that there is no winner or tie yet.
//               Winner will hold the player value (1 or -1) if there's a winner.
//               Winner will hold a 'T' if there's a tie.

/*----- event listeners -----*/

squares.forEach((square) => {
  square.addEventListener('click', handleSquareClick);
});

// 6) Handle a player clicking the replay button:
resetBtn.addEventListener('click', init);

/*----- functions -----*/

init();

//reset everything!
function init() {
  board = Array(9).fill(null);
  winner = null;
  turn = 1;
  render();
}

function render() {
  renderBoard();
  renderMessage();
}

function renderBoard() {
  squares.forEach((square, idx) => {
    // set the square's text to "X", "O", or an empty string
    square.innerText = board[idx] === 1 ? 'X' : board[idx] === -1 ? 'O' : '';
    // changing text color to match player
    square.style.color = board[idx] === 1 ? COLOR[1] : COLOR['-1'];
  });
}
// -> -> 4.2.2) Render a message:
// -> -> -> 4.2.2.1) If winner has a value other than null (game still in progress), render
//                   whose turn it is - use the color name for the player, converting it to
//                   upper case.
// -> -> -> 4.2.2.2) If winner is equal to 'T' (tie), render a tie message.
// -> -> -> 4.2.2.3) Otherwise, render a congratulatory message to which player has won -
//                   use the color name for the player, converting it to uppercase.
function renderMessage() {
  if (winner === 'T') {
    h1.innerText = "Cat's Game! (Tie) 😹";
  } else if (winner !== null) {
    // Determine the winner's symbol ('X' or 'O') based on the value of 'winner'
    const winnerSymbol = winner === 1 ? 'X' : 'O';
    // Use the winner's symbol to determine the color
    const winnerColor = COLOR[winner];
    // Update the message to display the winner with the correct symbol and color
    h1.innerHTML = `<span style="color: ${winnerColor}">${winnerSymbol}</span> Wins! 🎉`;
  } else {
    // When the game is still in progress, show whose turn it is
    const turnSymbol = turn === 1 ? 'X' : 'O';
    const turnColor = COLOR[turn];
    h1.innerHTML = `<span style="color: ${turnColor}">${turnSymbol}'s</span> Turn`;
  }
}

// -> 4.3) Wait for the user to click a square

function handleSquareClick(e) {
  const idx = [...squares].findIndex((square) => square === e.target);
  if (board[idx] !== null || winner !== null) return;

  board[idx] = turn;
  turn *= -1;

  winner = checkWinner();
  render();
}

// checking for a winner using the combo array

function checkWinner() {
  // -> -> 5.6.1) Loop through the each of the winning combination arrays defined.
  for (let combo of winningCombinations) {
    const [a, b, c] = combo;
    if (board[a] !== null && board[a] === board[b] && board[a] === board[c]) {
      return board[a]; // Return the winner ('1' or '-1')
    }
  }

  // -> -> 5.7.1) Set winner to 'T' if there are no more nulls in the board array.
  //-> 5.7) If there's no winner, check if there's a tie:
  if (board.every((square) => square !== null)) {
    return 'T'; // Indicate a tie
  }

  return null; // No winner or tie
}
