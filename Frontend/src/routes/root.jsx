import { Outlet, useLocation } from "react-router-dom";

const Root = () => {
  const location = useLocation();
  const isLanding = location.pathname === "/AsyStorage";

  return (
    <>
      <Outlet />
    </>
  );
};

export default Root;
