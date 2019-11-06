/* @jsx h */
import { h, render, createContext, Fragment } from 'preact'
import { useContext, useState } from 'preact/hooks'
import 'normalize.css'
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
      />
      <span>
        {children}
        <div class='hint'>{question.isAnswered && question.answerId === id && hint}</div>
      </span>
    </label>
  )
}

function Question(props) {
  const { goToNextQuestion, addAnswer } = useContext(AppContext)
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
      addAnswer({ correct, id })
    },
  }

  return (
    <QuestionContext.Provider value={question}>
      <div class='question'>
        <div>
          <h2>{props.title}</h2>
          {props.children}
        </div>
        {isAnswered && (
          <button type='button' className='next-question' onClick={goToNextQuestion}>
            Следующий вопрос
          </button>
        )}
      </div>
    </QuestionContext.Provider>
  )
}

const questions = [
  {
    id: 'important_at_work',
    node: (
      <Question title='Что для Тани главное в работе?' id='important_at_work'>
        <Answer hint='Нет, Таня не работает в геймдеве' id='80_hours'>
          Возможность работать не менее 80 часов в неделю
        </Answer>
        <Answer correct hint='Верно!' id='money'>
          Деньги денюшки монетки
        </Answer>
        <Answer hint='Ноуп' id='social_medium'>
          Коллектив-корпоратив
        </Answer>
      </Question>
    ),
  },
  {
    id: 'favorite_game',
    node: (
      <Question title='Любимая игра Тани' id='favorite_game'>
        <Answer correct hint='Да, это правда' id='minecraft'>
          Майнкрафт
        </Answer>
        <Answer correct hint='Дедукия тебя не подводит' id='nensy'>
          Ненси Дрю
        </Answer>
        <Answer correct hint='Только здесь можно иметь 12 детей и жить без забот' id='sims'>
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
        <Answer hint='Ещё бы! Только Максиму не говорите' correct id='berta'>
          Берта
        </Answer>
      </Question>
    ),
  },
  {
    id: 'coffee',
    node: (
      <Question title='Любимый кофе Тани?' id='coffee'>
        <Answer
          hint='максим ты нормальный вообще что за вопрос и вообще это страны а не сорта в одной стране могуть быть разные сорта не шариш штоле'
          id='brazil'
        >
          Бразилия
        </Answer>
        <Answer
          hint='максим ты нормальный вообще что за вопрос и вообще это страны а не сорта в одной стране могуть быть разные сорта не шариш штоле'
          id='ethiopia'
        >
          Эфиопия
        </Answer>
        <Answer
          hint='максим ты нормальный вообще что за вопрос и вообще это страны а не сорта в одной стране могуть быть разные сорта не шариш штоле'
          id='kenya'
        >
          Кения
        </Answer>
      </Question>
    ),
  },
  {
    id: 'drug',
    node: (
      <Question title='Наркотик, с которого Таня слезла' id='drug'>
        <Answer hint='Вот гадай теперь, то ли не тот наркотик, то ли не слезла' id='heroin'>
          Героин
        </Answer>
        <Answer
          correct
          hint='В детстве Таня могла собрать из чудо-пачек маленький чудо-домик'
          id='wonder'
        >
          Чудо-шоколад
        </Answer>
        <Answer hint='Телеграм не считается!' id='social_networks'>
          Соцсети
        </Answer>
      </Question>
    ),
  },
]

function Results({ answers }) {
  const correctCount = answers.filter(answer => answer.correct).length
  const count = `${correctCount}/${answers.length}`
  const reload = () => location.reload()
  const result =
    correctCount === answers.length ? (
      'Ты эксперт по Тане'
    ) : (
      <Fragment>
        Ты не шаришь.{' '}
        <button type='button' onClick={reload}>
          Пройти ещё раз
        </button>
      </Fragment>
    )

  return (
    <div class='app'>
      <p>Счёт: {count}.</p>
      <p>Результат: {result}</p>
    </div>
  )
}

function App() {
  const [currentQuestion, setQuestion] = useState(questions[0])
  const [answers, setAnswers] = useState([])

  function goToNextQuestion() {
    const currentQuestionPosition = questions.findIndex(q => q.id === currentQuestion.id)
    setQuestion(questions[currentQuestionPosition + 1])
  }

  const globalApi = {
    goToNextQuestion,
    addAnswer(answer) {
      setAnswers([...answers, answer])
    },
  }

  if (!currentQuestion) {
    return <Results answers={answers} />
  }

  return (
    <AppContext.Provider value={globalApi} key={currentQuestion.id}>
      <div class='app'>
        <h1>Игра «Знаешь ли ты Таню»</h1>
        <div class='play-block'>{currentQuestion.node}</div>
      </div>
    </AppContext.Provider>
  )
}

render(<App />, document.getElementById('app'))
