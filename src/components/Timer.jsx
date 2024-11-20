import { useEffect } from "react";
import { useQuiz } from "../contexts/QuizContext";

function Timer() {
  
  const {dispatch, secondsRemaining} = useQuiz();
  
  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  useEffect(() => {
    const id = setInterval(() => {
      if (secondsRemaining > 0) {
        dispatch({ type: "tick" });
      } else {
        clearInterval(id);
      }
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, [dispatch, secondsRemaining]);

  return (
    <div className="timer">
    {mins < 10 && "0"}{mins}:
    {secs < 10 && "0"}{secs}
    </div>
  );
}

export default Timer;
