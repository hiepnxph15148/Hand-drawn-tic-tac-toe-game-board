import React, { useState } from 'react'


const GameBoard = ({ onSelectSquare, board }) => {



    // const [gameBoard,setGameBoard] = useState(initialGameBoard)   
    // function handleSelectSquare(rowIndex,colIndex){
    //     setGameBoard((prevGameBoard) =>{
    //         const updatedBoard = [...prevGameBoard.map(innerArray => [...innerArray])]
    //         updatedBoard[rowIndex][colIndex] = activePlayerSymbol; // Update the board with the current player's symbol
    //         return updatedBoard;
    //     })
    //     onSelectSquare();
    // }
    return (
        <ol id='game-board'>
            {board.map((row, rowIndex) =>
                <li key={rowIndex}>
                    <ol>
                        {row.map((playerSymbol, colIndex) =>
                            <li key={colIndex}>
                                <button onClick={() => onSelectSquare(rowIndex, colIndex)} 
                                    disabled={playerSymbol !== null}>
                                    {playerSymbol}
                                </button>
                            </li>
                        )}
                    </ol>
                </li>
            )}
        </ol>
    )
}
export default GameBoard;

