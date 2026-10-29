const Lifelines = ({ used, disabled, onFifty, onAudience, onStop }) => {
  return (
    <div className="lifelines">
      <button onClick={onFifty} disabled={disabled || used.fifty}>
        50:50
      </button>
      <button onClick={onAudience} disabled={disabled || used.audience}>
        Hỏi khán giả
      </button>
      <button onClick={onStop} disabled={disabled}>
        Dừng cuộc chơi
      </button>
    </div>
  );
};

export default Lifelines;