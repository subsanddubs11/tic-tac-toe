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

  const makeMove = (square, player) => {
    const availableSquares = grid.filter((square) => square.getMark() === 0).map((square) => square);

    if (!availableSquares.includes(square)) return;

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
  }
  const getActivePlayer = () => activePlayer;

  const printNextTurn = () => {
    grid.getGrid();
    console.log(`${getActivePlayer().name}'s turn`);
  };

  const playRound = (square) => {
    console.log(
      `${getActivePlayer().name} is making their move...`
    );
    grid.makeMove(square, getActivePlayer.mark());
  }

}

const gameGrid = GameGrid();