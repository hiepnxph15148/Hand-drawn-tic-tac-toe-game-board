import { useState } from "react"
import GameBoard from "./components/GameBoard"
import Player from "./components/Player"
import Log from "./components/log"
import { WINNING_COMBINATIONS } from "./winning-combinations"
import GameOver from "./components/GameOver"

const PLAYERS ={
  X: 'Player 1',
  O: 'Player 2'
};
//----------------------------------------------------------------
const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
]

function deriveActivePlayer(gameTurns) {
  let currentPlayer = 'X'; // Giả sử người chơi hiện tại là 'X' mặc định.

  // Nếu có bất kỳ lượt chơi nào trong trò chơi và lượt chơi gần đây nhất được thực hiện bởi 'X',
  // thì lượt tiếp theo sẽ là của 'O'.
  if (gameTurns.length > 0 && gameTurns[0].player === 'X') {
    currentPlayer = 'O';
  }
  return currentPlayer; // Trả về người chơi nên thực hiện lượt tiếp theo.
}

// check for a winner
function deriveWinner(gameBoard,players){
  let winner = null;
  // Check for a winner
  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbol = gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol = gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol = gameBoard[combination[2].row][combination[2].column];
    // Check if there is a winning combination
    if (
      firstSquareSymbol &&
      firstSquareSymbol === secondSquareSymbol &&
      firstSquareSymbol === thirdSquareSymbol
    ) {
      // Name player wins
      winner = players[firstSquareSymbol];
    }
  }
  return winner;
}
// khi restarts game thì tạo mới 
function deriveGameBoard(gameTurns){
  let gameBoard = [...INITIAL_GAME_BOARD.map(array => [...array])];
  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;
    gameBoard[row][col] = player; // Update the board with the current player's symbol
  }
  return gameBoard;
}

function App() {
  const [gameTurns, setGameTurns] = useState([])
  
  const [players, setPlayers] = useState(PLAYERS)

  //const[activePlayer,setActivePlayer] = useState('X')
  const activePlayer = deriveActivePlayer(gameTurns);
  // khi restarts game thì tạo mới 
  const gameBoard = deriveGameBoard (gameTurns);
  // Check for a winner
  const winner = deriveWinner(gameBoard,players);
  // Check for a draw
  const hasDraw = gameTurns.length === 9 && !winner;
  // nút thao tác chơi
  function handlePlayerChange(rowIndex, colIndex) {
    //setActivePlayer((curActivePlayer) =>curActivePlayer === 'X'? 'O' : 'X')
    setGameTurns((prevTurns) => {
      const currentPlayer = deriveActivePlayer(prevTurns);
      const updatedTurns = [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
        ...prevTurns,
      ];
      return updatedTurns;
    });
  }
  // nút restart game
  function handleRestartGame() {
    setGameTurns([]);
  }
  // nút đ��i tên người chơi
  function handlePlayerNameChange(symbol, newName) {
    setPlayers(prevPlayers => {
      return { ...prevPlayers,[symbol]: newName };
    });
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player initialName={PLAYERS.X}
            symbol={'X'}
            isActive={activePlayer === 'X'}
            onChangeName={handlePlayerNameChange}
          />
          <Player initialName={PLAYERS.O}
            symbol={'O'}
            isActive={activePlayer === 'O'}
            onChangeName={handlePlayerNameChange}
          />
        </ol>
        {(winner || hasDraw) && <GameOver winner={winner} onRestart={handleRestartGame} />}
        <GameBoard onSelectSquare={handlePlayerChange}
          board={gameBoard} />
      </div>
      <Log turns={gameTurns} />
    </main>
  )
}

export default App;
