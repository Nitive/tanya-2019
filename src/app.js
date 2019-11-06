import { h, render, createContext } from 'preact'
import { useContext, useState } from 'preact/hooks'
import './styles.css'

const QuestionContext = createContext()
const AppContext = createContext()

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

function Answer({ correct, children, hint, id }) {
  const question = useContext(QuestionContext)

  return (
    <label class={cn('answer', correct ? 'correct' : 'incorrect')}>
      <input
        type='radio'
        name={question.id}
        onClick={() => question.answer({ correct, id })}
        disabled={question.isAnswered}
      />{' '}
      {children}
      <div class='hint'>{question.isAnswered && question.answerId === id && hint}</div>
    </label>
  )
}

function Question(props) {
  const { goToNextQuestion } = useContext(AppContext)
  const [isAnswered, setIsAnswered] = useState(false)
  const [answerId, setAnswerId] = useState()

  const question = {
    id: props.id,
    title: props.title,
    isAnswered,
    answerId,
    answer({ correct, id }) {
      setIsAnswered(correct ? 'correct' : 'incorrect')
      setAnswerId(id)
    },
  }

  return (
    <QuestionContext.Provider value={question}>
      <form>
        <h2>{props.title}</h2>
        {props.children}
      </form>
      {isAnswered && <button onClick={goToNextQuestion}>next</button>}
    </QuestionContext.Provider>
  )
}

const questions = [
  {
    id: 'favorite_game',
    node: (
      <Question title='Любимая игра Тани' id='favorite_game'>
        <Answer correct hint='Таня любит все эти игры' id='minecraft'>
          Майнкрафт
        </Answer>
        <Answer correct hint='Таня любит все эти игры' id='nensy'>
          Ненси Дрю
        </Answer>
        <Answer correct hint='Таня любит все эти игры' id='sims'>
          Симс
        </Answer>
      </Question>
    ),
  },
  {
    id: 'favorite_person',
    node: (
      <Question title='Кого Таня больше всего любит?' id='favorite_person'>
        <Answer hint='Близко, но нет' id='maxim'>
          Максим
        </Answer>
        <Answer hint='Ам колин зе полис' id='tanya'>
          Таня
        </Answer>
        <Answer hint='Ещё бы' correct id='berta'>
          Берта
        </Answer>
      </Question>
    ),
  },
]

function Results() {
  return <div>Ты эксперт по Тане</div>
}

function App() {
  const [currentQuestion, setQuestion] = useState(questions[0])

  function goToNextQuestion() {
    const currentQuestionPosition = questions.findIndex(q => q.id === currentQuestion.id)
    setQuestion(questions[currentQuestionPosition + 1])
  }

  const globalApi = {
    goToNextQuestion,
  }

  if (!currentQuestion) {
    return <Results />
  }

  return (
    <AppContext.Provider value={globalApi} key={currentQuestion.id}>
      {currentQuestion.node}
    </AppContext.Provider>
  )
}

// Inject your application into the an element with the id `app`.
// Make sure that such an element exists in the dom ;)
render(<App />, document.getElementById('app'))
