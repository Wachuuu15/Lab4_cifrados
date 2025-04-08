import { NavBar } from "@components/index";
import { Outlet, useLocation } from "react-router-dom";

const Root = () => {
  const location = useLocation();
  const isLanding = location.pathname === "/AsyStorage";

  return (
    <>
      <NavBar isLanding={isLanding} />
      <Outlet />
    </>
  );
};

export default Root;
