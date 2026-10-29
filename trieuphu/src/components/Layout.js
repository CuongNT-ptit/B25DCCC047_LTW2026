import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

const Layout = () => {
  return (
    <div>
      <NavBar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
