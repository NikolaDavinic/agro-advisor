import { ReactElement, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import BottomNav from "../BottomNav/BottomNav";
import Sidebar from "../Sidebar/Sidebar";

const Navigation = () => {
  const [isDesktop, setDesktop] = useState(window.innerWidth > 650);

  const updateMedia = () => {
    setDesktop(window.innerWidth > 650);
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  }, []);

  return isDesktop ? (
    <Sidebar>
      <Outlet />
    </Sidebar>
  ) : (
    <BottomNav>
      <Outlet />
    </BottomNav>
  );
};

export default Navigation;
