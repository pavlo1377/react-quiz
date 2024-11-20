import { createContext, useContext, useEffect, useReducer } from "react";
// 1) Створюємо контекст
const QuizContext = createContext();

const SECS_FOR_QUESTION = 30;

const initialState = {
  questions: [],
  // loading, error, ready, active, finished
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      if (!state.questions.length) return state;
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_FOR_QUESTION,
      };
    case "newAnswer":
      const question = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "restart":
      return {
        ...state,
        index: 0,
        answer: null,
        points: 0,
        status: "active",
        secondsRemaining: state.questions.length * SECS_FOR_QUESTION,
      };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 1 ? "finished" : state.status,
      };
    default:
      throw new Error("Action unknown");
  }
}
// 2) Створюєм компонент-обгортку для компонентів які хочуть отримати контекст
function QuizProvider({ children }) {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, current) => prev + current.points,
    0
  );

  

  useEffect(() => {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

//   3) Повертаємо з компонента-обгортки провайдер контексту який отримує children і всі вони отримують доступ до value 
  return (
    <QuizContext.Provider
      value={{
        questions,
        status,
        index,
        answer,
        points,
        highscore,
        secondsRemaining,
        numQuestions,
        maxPossiblePoints,
        dispatch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

// 4) Отримуєм доступ до value в обгорнутих компонентах двома способами : 1) Кожного разу викликаємо
//  const value = useContext(QuizContext) або 2) Створюємо тут кастомний хук який повертаєм value і просто імпортуєм його
//  та користуємось в обгорнутиї компонентах : const value = useQuiz();

function useQuiz() {
  const value = useContext(QuizContext);
  if (value === "undefined")
    throw new Error("The QuizContext was used outside of QuizProvider");
  return value;
}

export { useQuiz, QuizProvider };
