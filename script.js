function GameGrid () {
  const rows = 3;
  const cols = 3;
  const grid = [];

  for (let i = 0; i < rows; i++) {
    grid[i] = [];

    for (let j = 0; j < cols; j++) {
      grid[i].push(Square());
    }
  }

  const getGrid = () => grid;

  const makeMove = (row, col, player) => {
    const square = grid[row][col];

    if (square.getMark() !== 0) return false;

    square.addMark(player);
    return true;
  }

  const printGrid = () => {
    const gridWithSquareMarks = grid.map((row) => row.map((square) => square.getMark()));
    console.log(gridWithSquareMarks);
  }

  const checkSurroundingValues = (row, col) => {
    const directions  = [
      {row: -1, col: 0}, // Square above
      {row: 1, col: 0}, // Square below
      {row: 0, col: -1}, // Square to the left
      {row: 0, col: 1}, // Square to the right
      {row: -1, col: -1}, // Square to the top-left diagonal
      {row: -1, col: 1}, // Square to the top-right diagonal
      {row: 1, col: -1}, // Square to the bottom-left diagonal
      {row: 1, col: 1} // Square to the bottom-right diagonal
    ]

    const values = {};

    for (const {row: r, col: c} of directions) {
      const newRow = row + r;
      const newCol = col + c;

      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
        values[`(${newRow}, ${newCol})`] = grid[newRow][newCol].getMark();
      } else {
        values[`(${newRow}, ${newCol})`] = null;
      }
    }
    
    return values;
  }

  return { getGrid, makeMove, printGrid, checkSurroundingValues };
}

function Square () {
  let mark = 0;

  const addMark = (player) => {
    mark = player;
  }

  const getMark = () => mark; 

  return { addMark, getMark };
} 

function GameController(
  playerOneName = 'Player One',
  playerTwoName = 'Player Two'
) {

  const grid = GameGrid();

  const players = [
    {
      name: playerOneName,
      mark: 'X'
    },
    {
      name: playerTwoName,
      mark: 'O'
    }
  ];

  let activePlayer = players[0];

  const switchTurns = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const printNextTurn = () => {
    grid.printGrid();
    console.log(`${getActivePlayer().name}'s turn`);
  };

  const checkWin = (row, col) => {
    const surroundingValues = grid.checkSurroundingValues(row, col);
  }

  const playRound = (row, col) => {
    let isValidMove = false;

    console.log(`${getActivePlayer().name} is making their move...`);

    isValidMove = grid.makeMove(row, col, getActivePlayer().mark);

    if(!isValidMove) {
      console.log('Invalid move. Try again')
    } else {
      const surroundingValues = grid.checkSurroundingValues(row, col);
      console.log('Values around the move: ', surroundingValues);
      switchTurns();
      printNextTurn();
    }
  };

  printNextTurn();

  return { playRound, getActivePlayer };
}

const game = GameController();