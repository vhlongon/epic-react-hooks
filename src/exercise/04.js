// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

const calculateStatus = (winner, squares, nextValue) =>
  winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`

const calculateNextValue = squares =>
  squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'

const calculateWinner = squares => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

const Square = ({i, squares, onClick}) => (
  <button className="square" onClick={() => onClick(i)}>
    {squares[i]}
  </button>
)

const Board = ({onClick, squares}) => (
  <div>
    <div className="board-row">
      <Square i={0} squares={squares} onClick={onClick} />
      <Square i={1} squares={squares} onClick={onClick} />
      <Square i={2} squares={squares} onClick={onClick} />
    </div>
    <div className="board-row">
      <Square i={3} squares={squares} onClick={onClick} />
      <Square i={4} squares={squares} onClick={onClick} />
      <Square i={5} squares={squares} onClick={onClick} />
    </div>
    <div className="board-row">
      <Square i={6} squares={squares} onClick={onClick} />
      <Square i={7} squares={squares} onClick={onClick} />
      <Square i={8} squares={squares} onClick={onClick} />
    </div>
  </div>
)

const Game = () => {
  const initialSquares = Array(9).fill(null)
  const [step, setStep] = useLocalStorageState('step', 0)
  const [history, setHistory] = useLocalStorageState('tic-tac-toe:history', [
    initialSquares,
  ])
  const currentSquares = history[step]
  const nextValue = calculateNextValue(currentSquares)
  const winner = calculateWinner(currentSquares)
  const status = calculateStatus(winner, currentSquares, nextValue)

  const selectSquare = square => {
    if (winner || currentSquares[square]) {
      return
    }

    const clonedSquares = [...currentSquares]
    clonedSquares[square] = nextValue
    setHistory(history => [...history, clonedSquares])
    setStep(history.length)
  }

  const restart = () => {
    setStep(0)
    setHistory([initialSquares])
  }

  const selectStep = step => {
    setStep(step)
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={currentSquares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>
          {history.map((_, i) => {
            const isCurrent = step === i
            return (
              <li>
                <button
                  key={`step-${i}`}
                  disabled={isCurrent}
                  onClick={() => selectStep(i)}
                >
                  {i === 0 ? 'Go to game start' : `Go to move #${i}`}
                  {`${isCurrent ? ' (current)' : ''}`}
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

const App = () => <Game />

export default App
