const StudentItem = ({ student, onDelete }) => {
  const { id, name, score, class: className } = student;
  const xepLoai = score >= 8 ? "Giỏi" : score < 5 ? "Trượt" : "Bình thường";

  return (
    <tr>
      <td>{name}</td>
      <td>{score}</td>
      <td>{className}</td>
      <td>{xepLoai}</td>
      <td>
        <button onClick={() => onDelete(id)}>Xóa</button>
      </td>
    </tr>
  );
};

export default StudentItem;