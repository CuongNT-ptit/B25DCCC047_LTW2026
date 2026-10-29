import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { formatMoney } from "../data";

const messages = {
  win: "Chúc mừng! Bạn đã trở thành triệu phú",
  wrong: "Rất tiếc, bạn đã trả lời sai",
  timeout: "Hết giờ!",
  stop: "Bạn đã dừng cuộc chơi",
};

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state;

  if (!result) {
    return <Navigate to="/" replace />;
  }

  const { name, prize, correctCount, reason } = result;

  return (
    <div>
      <h2>{messages[reason]}</h2>
      <p>Người chơi: {name}</p>
      <p>Số câu trả lời đúng: {correctCount}</p>
      <p>Tiền thưởng: {formatMoney(prize)}</p>
      <button onClick={() => navigate("/play")}>Chơi lại</button>
      <button onClick={() => navigate("/")}>Về trang chủ</button>
    </div>
  );
};

export default Result;