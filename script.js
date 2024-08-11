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

    if (square.getMark() !== 0) return;

    square.addMark(player);
  }

  const printGrid = () => {
    const gridWithSquareMarks = grid.map((row) => row.map((square) => square.getMark()));
    console.log(gridWithSquareMarks);
  }

  return { getGrid, makeMove, printGrid };
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

  const playRound = (row, col) => {
    console.log(
      `${getActivePlayer().name} is making their move...`
    );
    grid.makeMove(row, col, getActivePlayer().mark);

    switchTurns();
    printNextTurn();
  };

  printNextTurn();

  return { playRound, getActivePlayer };
}

const game = GameController();