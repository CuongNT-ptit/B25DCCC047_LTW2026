const AnswerButton = ({ letter, text, state, hidden, disabled, onClick }) => {
  if (hidden) {
    return <button className="answer" disabled></button>;
  }

  return (
    <button
      className={`answer ${state}`}
      disabled={disabled}
      onClick={onClick}
    >
      {letter}. {text}
    </button>
  );
};

export default AnswerButton;