import { Navigate, Outlet } from "react-router-dom";

export default function PrivateComponent() {
  const isAuth = !!localStorage.getItem("token"); // change if you use something else
  return isAuth ? <Outlet /> : <Navigate to="/" replace />;
}
