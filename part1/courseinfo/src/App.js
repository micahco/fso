const Header = ({ course }) => {
  return (
    <header>
      <h1>{course}</h1>
    </header>
  )
}

const Part = ({ name, exercises } ) => {
  return (
    <p>{name} {exercises}</p>
  )
}

const Content = (props) => {
  const [part1, part2, part3] = props.parts
  return (
    <main>
      <Part name={part1.name} exercises={part1.exercises} />
      <Part name={part2.name} exercises={part2.exercises} />
      <Part name={part3.name} exercises={part3.exercises} />
    </main>
  )
}

const Footer = (props) => {
  const [part1, part2, part3] = props.parts
  return (
    <footer>
      <p>Number of exercises {part1.exercises + part2.exercises + part3.exercises}</p>
    </footer>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Footer parts={course.parts} />
    </div>
  )
}

export default App