import { useNavigate } from "react-router-dom";
import { PRIZES, TIME_PER_QUESTION, formatMoney } from "../data";

const Home = ({ playerName, setPlayerName }) => {
  const navigate = useNavigate();

  const handleStart = () => {
    setPlayerName(playerName.trim());
    navigate("/play");
  };

  return (
    <div>
      <h1>Ai là triệu phú</h1>

      <h3>Luật chơi</h3>
      <ul>
        <li>Trả lời lần lượt 15 câu hỏi trắc nghiệm về HTML, CSS, ES6, React.</li>
        <li>
          Mỗi câu có {TIME_PER_QUESTION} giây, hết giờ được tính như trả lời sai.
        </li>
        <li>
          Trả lời đúng cả 15 câu để nhận {formatMoney(PRIZES[14])}.
        </li>
        <li>
          Câu 5, 10, 15 là các mốc an toàn. Trả lời sai thì chỉ nhận tiền của mốc
          cao nhất đã vượt qua.
        </li>
        <li>Có 3 quyền trợ giúp và có thể dừng cuộc chơi để mang tiền về.</li>
      </ul>

      <label>Tên người chơi: </label>
      <input
        type="text"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <button onClick={handleStart} disabled={playerName.trim() === ""}>
        Bắt đầu
      </button>
    </div>
  );
};

export default Home;