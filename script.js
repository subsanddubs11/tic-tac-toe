const winnerMessage = document.getElementById('winner-message');
const gameBoard = document.getElementById('game-board');
const gameTiles = document.querySelectorAll('.tile');
const resetBtn = document.getElementById('reset-btn');

function GameGrid () {
  const grid = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => Square()));

  const getGrid = () => grid;

  const makeMove = (row, col, player) => {
    const square = grid[row][col];

    if (square.getMark() !== 0) return false;

    square.addMark(player);

    return true;
  }

  const printGrid = () => {
    
    gameTiles.forEach((tile) => {
      const gridWithSquareMarks = grid.map((row) => row.map((square) => square.getMark()));

      const computedStyle = window.getComputedStyle(tile);
      const tileRow = parseInt(computedStyle.gridRow) - 1;
      const tileColumn = parseInt(computedStyle.gridColumn) - 1;
      
      const tileMark = gridWithSquareMarks[tileRow][tileColumn];

      if (!tileMark) {
        return;
      } else {
        tile.innerHTML = `<p class="mark">${tileMark}</p>`
      }
    })
  }

  const checkSurroundingValues = (row, col) => {
    const directions  = [
      {direction: 'vertical', row: -1, col: 0}, 
      {direction: 'vertical', row: 1, col: 0},
      {direction: 'horizontal', row: 0, col: -1},
      {direction: 'horizontal', row: 0, col: 1},
      {direction: 'downwards-diagonal', row: -1, col: -1},
      {direction: 'downwards-diagonal', row: 1, col: 1},
      {direction: 'upwards-diagonal', row: -1, col: 1},
      {direction: 'upwards-diagonal', row: 1, col: -1}
    ]

    const values = {
      mark: grid[row][col].getMark(),
      directions: []
    };

    for (const dir of directions) {
      const { direction, row: r, col: c } = dir;
      let newRow = row + r;
      let newCol = col + c;

      while (newRow >= 0 && newRow < 3 && newCol >= 0 && newCol < 3) {
        values.directions.push( { direction, value: grid[newRow][newCol].getMark() });
        newRow += r;
        newCol += c;
      }
    }

    const resetBoard = () => {
      gameTiles.forEach((tile) => {
        tile.innerHTML = '';
      })
      grid.forEach((row) => row.forEach((square) => square.addMark(0)));
      printGrid();
    }

    resetBtn.addEventListener('click', resetBoard);

    return values;
  }

  return { getGrid, makeMove, printGrid, checkSurroundingValues };
}

function Square () {
  let mark = 0;
  const addMark = (player) => mark = player;
  const getMark = () => mark; 
  return { addMark, getMark };
} 

function GameController(playerOneName = 'Player One', playerTwoName = 'Player Two') {
  const grid = GameGrid();
  const players = [
    { name: playerOneName, mark: 'X' },
    { name: playerTwoName, mark: 'O' }
  ];

  let activePlayer = players[0];

  const switchTurns = () => activePlayer = activePlayer === players[0] ? players[1] : players[0];

  const getActivePlayer = () => activePlayer;

  const printNextTurn = () => {
    grid.printGrid();
  };

  const isBoardFull = () => {
    const gridWithSquareMarks = grid.getGrid().flat().map(square => square.getMark());
    return gridWithSquareMarks.every(mark => mark !== 0);
  }

  const checkWin = (row, col) => {
    const gridObject = grid.checkSurroundingValues(row, col);
    const mark = gridObject.mark;
    const directions = gridObject.directions;

    const filteredDirections = directions.filter((obj) => obj.value === mark).map((el) => el.direction);

    if (filteredDirections.some((value, index) => filteredDirections.indexOf(value) !== filteredDirections.lastIndexOf(value))) {
      return true;
    } else if (isBoardFull()) {
      winnerMessage.innerHTML = `<h2>It\'s a tie :(</h2>`;
      disableGame();
      grid.printGrid();
      return false;
    } else {
      return false;
    }
  }

  const playRound = (row, col) => {

    let isValidMove = false;
    isValidMove = grid.makeMove(row, col, getActivePlayer().mark);

    if(!isValidMove) {
      alert('Invalid move. Try again');
    } else {
      if (checkWin(row, col)) {
        winnerMessage.innerHTML = `<h2>${getActivePlayer().name} won the game!</h2>`
        disableGame();
        grid.printGrid();
        return;
      } 
    
      switchTurns();
      printNextTurn();
    }
  };
  
  const handleClick = (event) => {
    const computedStyle = window.getComputedStyle(event.currentTarget);
    const tileRow = parseInt(computedStyle.gridRow) - 1;
    const tileColumn = parseInt(computedStyle.gridColumn) - 1;
    return game.playRound(tileRow, tileColumn);
  }

  const startGame = () => {
    gameTiles.forEach((tile) => {
      tile.addEventListener('click', handleClick);
    });
  }

  const disableGame = () => {
    gameTiles.forEach((tile) => {
      tile.removeEventListener('click', handleClick);
    })
  }

  const resetGame = () => {
    startGame();
    winnerMessage.innerHTML = '';
    activePlayer = players[0];
  }

  resetBtn.addEventListener('click', resetGame);

  startGame();
  printNextTurn();

  return { playRound, getActivePlayer, startGame };
}

const game = GameController();