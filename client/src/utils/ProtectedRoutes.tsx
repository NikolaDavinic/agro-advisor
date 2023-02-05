import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../contexts/auth.context";
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
  const { isAuthenticated } = useAuthContext();
  console.log("rg");
  return isAuthenticated() ? <Outlet /> : <Navigate to={redirectPath} />;
};

export default ProtectedRoutes;
