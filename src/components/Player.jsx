import React from 'react'
import { useState } from 'react'

const Player = ({ initialName, symbol, isActive, onChangeName }) => {
    const [playerName, setPlayerName] = useState(initialName);
    const [isEditing, setIsEditing] = useState(false);

    // Update player name when the parent component calls onChangeName
    function handleEditClick() {
        setIsEditing((editing) => !editing);
        if (isEditing) {
            onChangeName(symbol, playerName);
        }
    }
    // Update player name when the user hits Enter key in the input field
    function handleOnChange(event) {
        setPlayerName(event.target.value);
    }
    // Update player name when the user hits
    let editablePlayerName = <span className="player-name">{playerName}</span>
    //let btnCaptions = 'Edit';
    if (isEditing) {
        editablePlayerName = <input type="text" required value={playerName} onChange={handleOnChange} />
        // btnCaptions = 'Save';
    }
    return (
        <li className={isActive ? 'active' : undefined}>
            <span className="player">
                {editablePlayerName}
                <span className="player-symbol">{symbol}</span>
            </span>
            <button onClick={handleEditClick}>{isEditing ? 'Save' : 'Edit'}</button>
        </li>
    )
}

export default Player