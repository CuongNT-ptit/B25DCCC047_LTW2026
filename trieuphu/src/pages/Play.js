import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";
import Timer from "../components/Timer";
import MoneyLadder from "../components/MoneyLadder";
import Lifelines from "../components/Lifelines";
import AudienceChart from "../components/AudienceChart";
import { PRIZES, TIME_PER_QUESTION, LETTERS } from "../data";
import { calcPrize, makeAudience } from "../utils";

const endGame = (navigate, addHistory, name, correctCount, reason) => {
  const prize = calcPrize(correctCount, reason);
  addHistory(name, prize, correctCount);
  navigate("/result", {
    replace: true,
    state: { name, prize, correctCount, reason },
  });
};

const Play = ({ playerName, questions, loading, error, addHistory }) => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [status, setStatus] = useState("answering");
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [hidden, setHidden] = useState([]);
  const [audience, setAudience] = useState(null);
  const [used, setUsed] = useState({ fifty: false, audience: false });

  useEffect(() => {
    if (status !== "answering" || loading || error) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [status, loading, error]);

  useEffect(() => {
    if (status === "answering" && timeLeft === 0) {
      endGame(navigate, addHistory, playerName, current, "timeout");
    }
  }, [status, timeLeft, current, navigate, playerName, addHistory]);

  useEffect(() => {
    if (status === "locked") {
      const t = setTimeout(() => setStatus("revealed"), 1000);
      return () => clearTimeout(t);
    }
    if (status === "revealed") {
      const t = setTimeout(() => {
        if (selected !== questions[current].answer) {
          endGame(navigate, addHistory, playerName, current, "wrong");
        } else if (current === questions.length - 1) {
          endGame(navigate, addHistory, playerName, current + 1, "win");
        } else {
          setCurrent(current + 1);
          setSelected(null);
          setTimeLeft(TIME_PER_QUESTION);
          setHidden([]);
          setAudience(null);
          setStatus("answering");
        }
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [status, selected, current, questions, navigate, playerName, addHistory]);

  useEffect(() => {
    const handleKey = (e) => {
      if (loading || error) return;
      if (status !== "answering") return;
      const pos = LETTERS.indexOf(e.key.toUpperCase());
      if (pos === -1 || hidden.includes(pos)) return;
      setSelected(pos);
      setStatus("locked");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [status, hidden, loading, error]);

  useEffect(() => {
    document.title = `Câu ${current + 1}/15 – ${playerName}`;
    return () => {
      document.title = "Ai là triệu phú";
    };
  }, [current, playerName]);

  const handleSelect = (index) => {
    if (status !== "answering") return;
    setSelected(index);
    setStatus("locked");
  };

  const handleFifty = () => {
    const answer = questions[current].answer;
    const wrong = [0, 1, 2, 3].filter((i) => i !== answer);
    const keep = wrong[Math.floor(Math.random() * wrong.length)];
    setHidden(wrong.filter((i) => i !== keep).concat(keep).slice(0, 2));
    setUsed({ ...used, fifty: true });
  };

  const handleAudience = () => {
    setAudience(makeAudience(questions[current].answer, hidden));
    setUsed({ ...used, audience: true });
  };

  const handleStop = () => {
    endGame(navigate, addHistory, playerName, current, "stop");
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
          hidden={hidden}
          onSelect={handleSelect}
        />
        <Lifelines
          used={used}
          disabled={status !== "answering"}
          onFifty={handleFifty}
          onAudience={handleAudience}
          onStop={handleStop}
        />
        {audience && <AudienceChart percents={audience} />}
      </div>
      <MoneyLadder current={current} />
    </div>
  );
};

export default Play;