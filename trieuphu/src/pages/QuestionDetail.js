import { useParams, useNavigate } from "react-router-dom";
import { LEVELS, LETTERS } from "../data";

const QuestionDetail = ({ questions, loading, error }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  if (loading) return <p>Đang tải câu hỏi...</p>;
  if (error) return <p>Không tải được câu hỏi</p>;

  const question = questions.find((q) => q.id === Number(id));

  if (!question) {
    return (
      <div>
        <p>Không tìm thấy câu hỏi</p>
        <button onClick={() => navigate(-1)}>Quay lại</button>
      </div>
    );
  }

  return (
    <div>
      <h2>
        Câu hỏi số {question.id} ({LEVELS[question.level]})
      </h2>
      <p>{question.question}</p>

      {question.options.map((option, index) => (
        <p
          key={index}
          className={index === question.answer ? "option correct" : "option"}
        >
          {LETTERS[index]}. {option}
          {index === question.answer && " (Đáp án đúng)"}
        </p>
      ))}

      <button onClick={() => navigate(-1)}>Quay lại</button>
    </div>
  );
};

export default QuestionDetail;
