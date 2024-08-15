import { useState, useEffect } from "react";
import GameBoard from "./components/GameBoard";
import Player from "./components/Player";
import Log from "./components/Log";
import { WINNING_COMBINATIONS } from "./winning-combinations";
import GameOver from "./components/GameOver";

const PLAYERS = {
  X: 'Player 1',
  O: 'Bot' // Bot will play as Player 2
};

const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function deriveActivePlayer(gameTurns) {
  let currentPlayer = 'X'; // Assume the current player is 'X' by default.

  if (gameTurns.length > 0 && gameTurns[0].player === 'X') {
    currentPlayer = 'O';
  }
  return currentPlayer; // Return the player who should make the next move.
}

function deriveWinner(gameBoard, players) {
  let winner = null;
  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbol = gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol = gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol = gameBoard[combination[2].row][combination[2].column];
    if (
      firstSquareSymbol &&
      firstSquareSymbol === secondSquareSymbol &&
      firstSquareSymbol === thirdSquareSymbol
    ) {
      winner = players[firstSquareSymbol];
    }
  }
  return winner;
}

function deriveGameBoard(gameTurns) {
  let gameBoard = [...INITIAL_GAME_BOARD.map(array => [...array])];
  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;
    gameBoard[row][col] = player; // Update the board with the current player's symbol
  }
  return gameBoard;
}

function App() {
  const [gameTurns, setGameTurns] = useState([]);
  const [players, setPlayers] = useState(PLAYERS);
  const [difficulty, setDifficulty] = useState('Easy'); // Manage difficulty level
  const activePlayer = deriveActivePlayer(gameTurns);
  const gameBoard = deriveGameBoard(gameTurns);
  const winner = deriveWinner(gameBoard, players);
  const hasDraw = gameTurns.length === 9 && !winner;

  // Bot logic based on difficulty
  function handleBotMove() {
    const emptySquares = [];
    gameBoard.forEach((row, rowIndex) => {
      row.forEach((square, colIndex) => {
        if (square === null) {
          emptySquares.push({ row: rowIndex, col: colIndex });
        }
      });
    });

    if (emptySquares.length > 0) {
      let botMove;

      if (difficulty === 'Easy') {
        botMove = emptySquares[Math.floor(Math.random() * emptySquares.length)];
      } else if (difficulty === 'Medium' || difficulty === 'Hard') {
        // Medium: Try to block the opponent
        botMove = findBestMove(gameBoard, 'X') || emptySquares[Math.floor(Math.random() * emptySquares.length)];

        // Hard: Prioritize winning
        if (difficulty === 'Hard') {
          botMove = findBestMove(gameBoard, 'O') || botMove;
        }
      }

      handlePlayerChange(botMove.row, botMove.col);
    }
  }

  function findBestMove(board, player) {
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      const [rowA, colA] = [a.row, a.column];
      const [rowB, colB] = [b.row, b.column];
      const [rowC, colC] = [c.row, c.column];

      if (
        board[rowA][colA] === player &&
        board[rowB][colB] === player &&
        board[rowC][colC] === null
      ) {
        return { row: rowC, col: colC };
      } else if (
        board[rowA][colA] === player &&
        board[rowC][colC] === player &&
        board[rowB][colB] === null
      ) {
        return { row: rowB, col: colB };
      } else if (
        board[rowB][colB] === player &&
        board[rowC][colC] === player &&
        board[rowA][colA] === null
      ) {
        return { row: rowA, col: colA };
      }
    }
    return null;
  }

  useEffect(() => {
    if (activePlayer === 'O' && !winner && !hasDraw) {
      setTimeout(handleBotMove, 1000); // 1-second delay for bot move
    }
  }, [gameTurns]);

  function handlePlayerChange(rowIndex, colIndex) {
    setGameTurns((prevTurns) => {
      const currentPlayer = deriveActivePlayer(prevTurns);
      const updatedTurns = [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
        ...prevTurns,
      ];
      return updatedTurns;
    });
  }

  function handleRestartGame() {
    setGameTurns([]);
  }

  function handlePlayerNameChange(symbol, newName) {
    setPlayers(prevPlayers => {
      return { ...prevPlayers, [symbol]: newName };
    });
  }

  function handleDifficultyChange(event) {
    setDifficulty(event.target.value);
  }

  return (
    <main>
      <div id="game-container">
        <div>
          <label>
            Select Difficulty: 
            <select  className="difficulty-select" value={difficulty} onChange={handleDifficultyChange}>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </label>
        </div>
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
  );
}

export default App;
