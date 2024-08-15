import React from 'react'


const GameOver = ({ winner }) => {
    return (
        <div id='game-over'>
            <h2>GameOver !</h2>
            {winner &&<p>{winner} won!</p>}
            {!winner &&<p>Is&apos;s a draw!</p>}
            <p>
                <button>Rematch!</button>
            </p>
        </div>
    )
}

export default GameOver