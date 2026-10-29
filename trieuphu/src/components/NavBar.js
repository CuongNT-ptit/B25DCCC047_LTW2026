import { NavLink } from "react-router-dom";

const NavBar = () => {
  const getStyle = ({ isActive }) => {
    return isActive ? { color: "red", fontWeight: "bold" } : {};
  };

  return (
    <nav className="navbar">
      <NavLink to="/" end style={getStyle}>
        Trang chủ
      </NavLink>
      <NavLink to="/questions" style={getStyle}>
        Ngân hàng câu hỏi
      </NavLink>
      <NavLink to="/history" style={getStyle}>
        Lịch sử
      </NavLink>
    </nav>
  );
};

export default NavBar;
