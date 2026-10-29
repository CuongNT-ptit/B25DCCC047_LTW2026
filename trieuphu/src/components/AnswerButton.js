const AnswerButton = ({ letter, text, state, disabled, onClick }) => {
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
 


