import { useState } from 'react'

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>

const Leader = ({ anecdotes, points, leader }) => (
  <div>
    <h1>Anecdote with most votes</h1>
    <p>{anecdotes[leader]}</p>
    <p>has {points[leader]} points</p>
  </div>
)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [points, setPoints] = useState(new Array(anecdotes.length).fill(0)) 
  const [leader, setLeader] = useState(null)
  const [selected, setSelected] = useState(getRandomInt(0, anecdotes.length))

  const isLeader = (newPoints) => {
    return leader === null || newPoints > points[leader]
  }

  const handleVoteClick = () => {
    const newPoints = [...points]
    newPoints[selected] += 1;
    setPoints(newPoints)
    if (isLeader(newPoints[selected])) {
      setLeader(selected)
    }
  }

  const handleNextClick = () => {
    if (selected === anecdotes.length - 1) {
      setSelected(0)
    } else {
      setSelected(selected + 1)
    }
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {points[selected]} points</p>
      <Button
        handleClick={handleVoteClick}
        text='vote' />
      <Button
        handleClick={handleNextClick}
        text='next anecdote' />
      {leader ? <Leader anecdotes={anecdotes} points={points} leader={leader} /> : null}
    </div>
  )
}

export default App