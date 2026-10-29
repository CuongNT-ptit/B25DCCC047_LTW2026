const Timer = ({ timeLeft }) => {
  return (
    <p className="timer" style={{ color: timeLeft <= 10 ? "red" : "black" }}>
      Còn {timeLeft} giây
    </p>
  );
};

export default Timer;