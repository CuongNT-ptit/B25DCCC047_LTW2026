import { useState } from "react";
import StudentTable from "./StudentTable";
import "./App.css";

const App = () => {
  const [students, setStudents] = useState([
    { id: 1, name: "Ngô Tuấn Cường", score: 8.5, class: "D25CQCC05-B" },
    { id: 2, name: "Phạm Quang Duy", score: 4, class: "D25CQCC05-B" },
    { id: 3, name: "Phan Việt Bằng", score: 6.5, class: "D25CQCC03-B" },
  ]);

  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [score, setScore] = useState("");
  const [className, setClassName] = useState("");

  const addStudent = (e) => {
    e.preventDefault();
    const scoreNum = parseFloat(score);

    if (!name.trim() || !className.trim() || score === "") {
      setError("Nhập đủ Họ tên, Điểm, Lớp");
      return;
    }
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 10) {
      setError("Điểm phải từ 0 đến 10");
      return;
    }

    const newStudent = { id: Date.now(), name, score: scoreNum, class: className };
    setStudents([...students, newStudent]);
    setError("");
    setName("");
    setScore("");
    setClassName("");
  };

  const deleteStudent = (id) => {
    setStudents(students.filter((s) => s.id !== id));
  };

  const filteredStudents = students.filter((s) => {
    if (filter === "gioi") return s.score >= 8;
    if (filter === "truot") return s.score < 5;
    return true;
  });

  const total = students.length;
  const avg = total === 0 ? 0 : students.reduce((sum, s) => sum + s.score, 0) / total;

  return (
    <div className="container">
      <h1>Quản lý điểm sinh viên</h1>

      <form onSubmit={addStudent}>
        <input placeholder="Họ tên" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Điểm" value={score} onChange={(e) => setScore(e.target.value)} />
        <input placeholder="Lớp" value={className} onChange={(e) => setClassName(e.target.value)} />
        <button type="submit">Thêm</button>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="filter">
        <button onClick={() => setFilter("all")}>Tất cả</button>
        <button onClick={() => setFilter("gioi")}>Giỏi</button>
        <button onClick={() => setFilter("truot")}>Trượt</button>
      </div>

      <StudentTable students={filteredStudents} onDelete={deleteStudent} />

      <p>{`Tổng: ${total} - Điểm TB: ${avg.toFixed(2)}`}</p>
    </div>
  );
};

export default App;