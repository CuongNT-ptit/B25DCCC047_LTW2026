import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";
import Timer from "../components/Timer";
import MoneyLadder from "../components/MoneyLadder";
import { PRIZES, TIME_PER_QUESTION } from "../data";
import { calcPrize } from "../utils";

const endGame = (navigate, name, correctCount, reason) => {
  navigate("/result", {
    replace: true,
    state: {
      name: name,
      prize: calcPrize(correctCount, reason),
      correctCount: correctCount,
      reason: reason,
    },
  });
};

const Play = ({ playerName, questions, loading, error }) => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [status, setStatus] = useState("answering");
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);

  useEffect(() => {
    if (status !== "answering" || loading || error) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [status, loading, error]);

  useEffect(() => {
    if (status === "answering" && timeLeft === 0) {
      endGame(navigate, playerName, current, "timeout");
    }
  }, [status, timeLeft, current, navigate, playerName]);

  useEffect(() => {
    if (status === "locked") {
      const timeout = setTimeout(() => {
        setStatus("revealed");
      }, 1000);
      return () => clearTimeout(timeout);
    }

    if (status === "revealed") {
      const timeout = setTimeout(() => {
        const isCorrect = selected === questions[current].answer;

        if (!isCorrect) {
          endGame(navigate, playerName, current, "wrong");
        } else if (current === questions.length - 1) {
          endGame(navigate, playerName, current + 1, "win");
        } else {
          setCurrent(current + 1);
          setSelected(null);
          setTimeLeft(TIME_PER_QUESTION);
          setStatus("answering");
        }
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [status, selected, current, questions, navigate, playerName]);

  const handleSelect = (index) => {
    if (status !== "answering") return;
    setSelected(index);
    setStatus("locked");
  };

  if (loading) return <p>Đang tải câu hỏi...</p>;
  if (error) return <p>Không tải được câu hỏi</p>;

  return (
    <div className="play">
      <div className="play-main">
        <p>Người chơi: {playerName}</p>
        <Timer timeLeft={timeLeft} />
        <QuestionCard
          question={questions[current]}
          number={current + 1}
          total={PRIZES.length}
          status={status}
          selected={selected}
          onSelect={handleSelect}
        />
      </div>
      <MoneyLadder current={current} />
    </div>
  );
};

export default Play;