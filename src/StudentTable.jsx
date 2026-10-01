import StudentItem from "./StudentItem";

const StudentTable = ({ students, onDelete }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Họ tên</th>
          <th>Điểm</th>
          <th>Lớp</th>
          <th>Xếp loại</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {students.map((s) => (
          <StudentItem key={s.id} student={s} onDelete={onDelete} />
        ))}
      </tbody>
    </table>
  );
};

export default StudentTable;