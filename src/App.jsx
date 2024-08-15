import { useState, useEffect } from "react";
import GameBoard from "./components/GameBoard";
import Player from "./components/Player";
import Log from "./components/Log";
import { WINNING_COMBINATIONS } from "./winning-combinations";
import GameOver from "./components/GameOver";

// Define the players, with 'O' being the bot.
const PLAYERS = {
  X: 'Player 1',
  O: 'Bot'
};

// Initial game board setup, with all squares set to null.
const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

// Determine which player should take the next turn based on the previous moves.
function deriveActivePlayer(gameTurns) {
  let currentPlayer = 'X'; // Default to 'X' for the first move.

  // If the last move was made by 'X', the next move should be 'O'.
  if (gameTurns.length > 0 && gameTurns[0].player === 'X') {
    currentPlayer = 'O';
  }
  return currentPlayer;
}

// Check the game board to see if there is a winner.
function deriveWinner(gameBoard, players) {
  let winner = null;
  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbol = gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol = gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol = gameBoard[combination[2].row][combination[2].column];
    
    // If all three squares in a winning combination match, declare a winner.
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

// Update the game board based on the current game turns.
function deriveGameBoard(gameTurns) {
  let gameBoard = [...INITIAL_GAME_BOARD.map(array => [...array])];
  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;
    gameBoard[row][col] = player; // Place the player's symbol on the board.
  }
  return gameBoard;
}

function App() {
  const [gameTurns, setGameTurns] = useState([]); // Track the history of game turns.
  const [players, setPlayers] = useState(PLAYERS); // Manage player names and symbols.
  const [difficulty, setDifficulty] = useState('Easy'); // Manage difficulty level of the bot.
  const activePlayer = deriveActivePlayer(gameTurns); // Determine the active player.
  const gameBoard = deriveGameBoard(gameTurns); // Generate the current game board state.
  const winner = deriveWinner(gameBoard, players); // Check if there is a winner.
  const hasDraw = gameTurns.length === 9 && !winner; // Check for a draw.

  // Bot's move logic, which changes based on the selected difficulty level.
  function handleBotMove() {
    const emptySquares = [];
    gameBoard.forEach((row, rowIndex) => {
      row.forEach((square, colIndex) => {
        if (square === null) {
          emptySquares.push({ row: rowIndex, col: colIndex }); // Collect all empty squares.
        }
      });
    });

    if (emptySquares.length > 0) {
      let botMove;

      if (difficulty === 'Easy') {
        // In Easy mode, the bot randomly selects an empty square.
        botMove = emptySquares[Math.floor(Math.random() * emptySquares.length)];
      } else if (difficulty === 'Medium' || difficulty === 'Hard') {
        // In Medium mode, the bot tries to block the opponent (Player 1) if possible.
        botMove = findBestMove(gameBoard, 'X') || emptySquares[Math.floor(Math.random() * emptySquares.length)];

        if (difficulty === 'Hard') {
          // In Hard mode, the bot prioritizes winning if possible.
          botMove = findBestMove(gameBoard, 'O') || botMove;
        }
      }

      handlePlayerChange(botMove.row, botMove.col); // Make the bot's move.
    }
  }

  // Function to find the best move for the bot based on the current board state.
  function findBestMove(board, player) {
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      const [rowA, colA] = [a.row, a.column];
      const [rowB, colB] = [b.row, b.column];
      const [rowC, colC] = [c.row, c.column];

      // Check if there are two matching symbols and an empty spot in a winning combination.
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

  // Trigger the bot's move with a 1-second delay if it's the bot's turn.
  useEffect(() => {
    if (activePlayer === 'O' && !winner && !hasDraw) {
      setTimeout(handleBotMove, 1000); // 1-second delay for bot move.
    }
  }, [gameTurns]);

  // Handle a player's move and update the game turns.
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

  // Restart the game by clearing the game turns.
  function handleRestartGame() {
    setGameTurns([]);
  }

  // Update the player's name.
  function handlePlayerNameChange(symbol, newName) {
    setPlayers(prevPlayers => {
      return { ...prevPlayers, [symbol]: newName };
    });
  }

  // Change the bot's difficulty level.
  function handleDifficultyChange(event) {
    setDifficulty(event.target.value);
  }

  return (
    <main>
      <div id="game-container">
        <div>
          <label>
            Select Difficulty: 
            <select className="difficulty-select" value={difficulty} onChange={handleDifficultyChange}>
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
