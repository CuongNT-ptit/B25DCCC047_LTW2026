import AnswerButton from "./AnswerButton";
import { LETTERS } from "../data";

const QuestionCard = ({
  question,
  number,
  total,
  status,
  selected,
  hidden,
  onSelect,
}) => {
  const getState = (index) => {
    if (status === "locked" && index === selected) return "locked";
    if (status === "revealed") {
      if (index === question.answer) return "correct";
      if (index === selected) return "wrong";
    }
    return "normal";
  };

  return (
    <div className="question-card">
      <p>
        Câu {number}/{total}
      </p>
      <h3>{question.question}</h3>

      <div className="answers">
        {question.options.map((option, index) => (
          <AnswerButton
            key={index}
            letter={LETTERS[index]}
            text={option}
            state={getState(index)}
            hidden={hidden.includes(index)}
            disabled={status !== "answering"}
            onClick={() => onSelect(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;