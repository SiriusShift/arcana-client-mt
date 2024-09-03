import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import PermittedRoutes from "./PermittedRoutes";
import { jwtDecode } from "jwt-decode";
function ProtectedRoutes() {
  const fullname = useSelector((state) => state.login.fullname);
  const permissions = useSelector((state) => state.permissions.permissions);
  // const token = useSelector((state) => state.login.userDetails.token);

  // const decode = jwtDecode(token);
  // const currentTime = Math.floor(Date.now() / 1000);
  // console.log(decode.exp, currentTime);


  if (!fullname || permissions?.length === 0) {
    return <Navigate to="/login" />;
  }

  // return <MainLayout />;
  return <PermittedRoutes />;
}

export default ProtectedRoutes;
