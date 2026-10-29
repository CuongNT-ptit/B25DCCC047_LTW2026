import { useState } from "react";
import { Link } from "react-router-dom";
import { LEVELS } from "../data";

const QuestionBank = ({ questions, loading, error }) => {
  const [level, setLevel] = useState("all");
  const [keyword, setKeyword] = useState("");

  const handleQueryShift = (e) => {
    setKeyword(e.target.value);
  };

  if (loading) return <p>Đang tải câu hỏi...</p>;
  if (error) return <p>Không tải được câu hỏi</p>;

  const filtered = questions.filter((q) => {
    const matchLevel = level === "all" || q.level === Number(level);
    const matchText = q.question.toLowerCase().includes(keyword.toLowerCase());
    return matchLevel && matchText;
  });

  return (
    <div>
      <h2>Ngân hàng câu hỏi</h2>

      <div className="filters">
        <label>Mức độ: </label>
        <select value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="all">Tất cả</option>
          <option value="1">Dễ</option>
          <option value="2">Trung bình</option>
          <option value="3">Khó</option>
        </select>

        <label>Tìm kiếm: </label>
        <input
          type="text"
          value={keyword}
          onChange={handleQueryShift}
          placeholder="Nhập nội dung câu hỏi"
        />
      </div>

      <p>Có {filtered.length} câu hỏi</p>

      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Mức độ</th>
            <th>Câu hỏi</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((q, index) => (
            <tr key={q.id}>
              <td>{index + 1}</td>
              <td>{LEVELS[q.level]}</td>
              <td>
                <Link to={`/questions/${q.id}`}>{q.question}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionBank;
