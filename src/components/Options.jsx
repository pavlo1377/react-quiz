import { useQuiz } from "../contexts/QuizContext";

function Options({question}) {
  const {dispatch, answer } = useQuiz();

  // if (!question) {
  //   return null; // Повертаємо нічого, якщо питання не існує
  // }

  const hasAnswered = answer !== null;

  return (
    <div className="options">
      {question.options.map((option, index) => (
        <button
          className={`btn btn-option ${index === answer ? "answer" : ""} ${
            hasAnswered
              ? index === question.correctOption
                ? "correct"
                : "wrong"
              : ""
          }`}
          key={option}
          disabled={hasAnswered}
          onClick={() => dispatch({ type: "newAnswer", payload: index })}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Options;
