import { Navigate, Outlet } from "react-router-dom";
// import { selectUser } from "../features/user/userSlice";
// import { useAppSelector } from "../hooks/app-redux";

interface ProtectedRoutesProps {
  isAllowed?: boolean;
  redirectPath?: string;
  children?: React.ReactNode;
}

const ProtectedRoutes = ({
  redirectPath = "/signin",
  isAllowed = true,
}: ProtectedRoutesProps) => {
  // const user = useAppSelector(selectUser);
  // const isAuthenticated = user?.authToken && isAllowed;
  // console.log(isAuthenticated);
  // return isAuthenticated ? <Outlet /> : <Navigate to="/signin" />;
  return <Outlet />;
};

export default ProtectedRoutes;
