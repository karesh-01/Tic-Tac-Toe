import { act, useState } from "react"


import Player from "./components/Player.jsx"
import GameBoard from "./components/GameBoard.jsx"
import Log from "./components/Log.jsx"
import { WINNING_COMBINATIONS } from "./winning-combinations.jsx"
import GameOver from "./components/GameOver.jsx"


const initialGameBoard  = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function deriveActivePlayer(gameTurn)
{
  let currentPlayer = 'X';
  if(gameTurn.length>0 && gameTurn[0].player==='X')
  {
      currentPlayer = 'O';
  }
  return currentPlayer;
}

function deriveGameBoard(gameTurns)
{
  let gameBoard = [...initialGameBoard.map(array=> [...array])];
  for(const turn of gameTurns)
    {
        const {square, player} = turn;
        const {row, col} = square;
        gameBoard[row][col] = player
    }
  return gameBoard;
}
function deriveWinner(gameBoard, players)
{
  let winner;
  for(const combination of WINNING_COMBINATIONS)
  {
    const firstSquareSymbol = gameBoard[combination[0].row][combination[0].column]
    const secondSquareSymbol = gameBoard[combination[1].row][combination[1].column]
    const thirdSquareSymbol = gameBoard[combination[2].row][combination[2].column]
    if(firstSquareSymbol && 
      firstSquareSymbol===secondSquareSymbol 
      && firstSquareSymbol===thirdSquareSymbol)
      {
        winner = players[firstSquareSymbol]
        break
      }
  }
  return winner
}

function App() {

  const [players,setPlayers] = useState({
    'X': 'Player 1',
    'O': 'Player 2'
  })
  const [gameTurns, setGameTurns] = useState([])
  const activePlayer = deriveActivePlayer(gameTurns);

  const gameBoard = deriveGameBoard(gameTurns)
  const winner = deriveWinner(gameBoard, players)
  const hasDraw = gameTurns.length ===9 && !winner;

  function handleSelectSquare(rowIndex, colIndex)
  {
    setGameTurns((prevTurns) =>{

      const currentPlayer = deriveActivePlayer(prevTurns)
      const updatedTurns = [{
        square: {row: rowIndex, col: colIndex}, player : currentPlayer
      }, ...prevTurns]
      return updatedTurns
    } )
  }

  function handleRestart()
  {
    setGameTurns([])
  }

  function handlePlayerNameChange(symbol, newName)
  {
    setPlayers(prevPlayers => {
      return {
        ...prevPlayers,
        [symbol]: newName
      }
    })
  }

  return (
    <main>
      <h1>TIC-TAC-TOE</h1>
      <div id="game-container">
        <ol id = "players" className="highlight-player">
          <Player name= "Player 1" symbol = 'X' isActive={activePlayer === 'X'} onChangeName={handlePlayerNameChange}/>
          <Player name= "Player 2" symbol = 'O' isActive={activePlayer === 'O'} onChangeName={handlePlayerNameChange}/>
        </ol>
        {(winner || hasDraw) && <GameOver winner={winner} onRestart={handleRestart}/>}
        <GameBoard onSelectSquare = {handleSelectSquare} board = {gameBoard}/>
      </div>
      <Log turns={gameTurns}/>
    </main>
  )
}

export default App
