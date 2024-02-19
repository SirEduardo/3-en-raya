import { useState } from 'react'
import './App.css'
import confetti from "canvas-confetti"
import {Square} from "./components/square.jsx"
import {TURNS} from './constants.jsx'
import { checkWinner,checkEndGame } from './board.jsx'

function App() {
  const [board, setBoard] = useState(() =>{
  const boardFromStorage = window.localStorage.getItem("board")
  if (boardFromStorage) return JSON.parse(boardFromStorage)
  return Array(9).fill(null)
  })
  const [turn, setTurn] = useState(() =>{
    const turnFromStorage = window.localStorage.getItem("turn")
    return turnFromStorage ?? TURNS.X
  })


  const [winner, setWinner] = useState(null)


  const resetGame = () =>{
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)

    window.localStorage.removeItem("board")
    window.localStorage.removeItem("turn")
  }

  const updateBoard = (index)=>{
    if(board[index]|| winner)  return
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)

    const newTurn = turn==TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)
    //guardar partida
    window.localStorage.setItem("board",JSON.stringify(newBoard))
    window.localStorage.setItem("turn",newTurn)

    const newwinner=checkWinner(newBoard)
    if (newwinner){
      confetti()
      setWinner(newwinner)
    }else if(checkEndGame(newBoard)){
      setWinner(false)
    }
  }
  return(
    <main className='board'>
    <h1>Tic tac toe</h1>
    <button onClick={resetGame}>Reset del Juego</button>
    <section className='game'>
    {
      board.map((square,index)=>{
        return(
          <Square
          key={index}
          index={index}
          updateBoard={updateBoard}
          >
          {square}
          </Square>
        )
      })
    }
    </section>
    <section className='turn'>
      <Square isSelected ={turn == TURNS.X}>
        {TURNS.O}
      </Square>
      <Square isSelected ={turn == TURNS.O}>
      {TURNS.X}
    </Square>
    </section>
    {
      winner !==null &&(
        <section className='winner'>
          <div className='text'>
            <h2>
            {
              winner == false
              ? "Empate"
              : "Ganó: "
            }
            </h2>

          <header className='win'>
            {winner&&<Square>{winner}</Square>}
          </header>

          <footer>
            <button onClick = {resetGame}>Empezar de nuevo</button>
          </footer>
          </div>
        </section>
      )
    }
    </main>
  )
}

export default App
