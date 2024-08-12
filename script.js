const winnerMessage = document.getElementById('winner-message');
const gameBoard = document.getElementById('game-board');

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
      {name: 'above', orientation: 'vertical', row: -1, col: 0}, // Square above
      {name: 'below', orientation: 'vertical', row: 1, col: 0}, // Square below
      {name: 'left', orientation: 'horizontal', row: 0, col: -1}, // Square to the left
      {name: 'right', orientation: 'horizontal', row: 0, col: 1}, // Square to the right
      {name: 'top-left', orientation: 'downwards-diagonal', row: -1, col: -1}, // Square to the top-left diagonal
      {name: 'top-right', orientation: 'upwards-diagonal', row: -1, col: 1}, // Square to the top-right diagonal
      {name: 'bottom-left', orientation: 'upwards-diagonal', row: 1, col: -1}, // Square to the bottom-left diagonal
      {name: 'bottom-right', orientation: 'downwards-diagonal', row: 1, col: 1} // Square to the bottom-right diagonal
    ]

    const values = {
      mark: grid[row][col].getMark(),
      directions: {}
    };

    for (const direction of directions) {
      const { name, orientation, row: r, col: c } = direction;
      let newRow = row + r;
      let newCol = col + c;
      values.directions[name] = [];

      while (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
        values.directions[name].push({orientationClass: orientation, value: grid[newRow][newCol].getMark()});
        newRow += r;
        newCol += c;
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
    const gridObject = grid.checkSurroundingValues(row, col);
    const currentMark = gridObject.mark;
    const directions = gridObject.directions;
    const matchingSquares = [];

    for (const direction in directions) {
      const subArray = directions[direction];
      for (let i = 0; i < 2; i++) {
        if(!subArray[i]) {
          continue;
        } else if (subArray[i].value === currentMark) {
          matchingSquares.push(subArray[i]);
        }
      }  
    } 

    for (let i = 0; i < matchingSquares.length; i++) {
      for (let j = i + 1; j < matchingSquares.length; j++) {
        if(matchingSquares[i].orientationClass === matchingSquares[j].orientationClass) {
          return true;
        }
      }
    }
    
    return false;
  }

  const playRound = (row, col) => {
    let isValidMove = false;

    console.log(`${getActivePlayer().name} is making their move...`);

    isValidMove = grid.makeMove(row, col, getActivePlayer().mark);

    if(!isValidMove) {
      console.log('Invalid move. Try again')
    } else {
      if (checkWin(row, col) === true) {
        winnerMessage.innerText = `${getActivePlayer().name} won the game!`;
        grid.printGrid();
        return;
      } 
    
      switchTurns();
      printNextTurn();
    }
  };

  printNextTurn();

  return { playRound, getActivePlayer };
}

const game = GameController();

const p = (row, col) => {
  game.playRound(row,col);
}