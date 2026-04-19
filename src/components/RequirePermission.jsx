import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RequirePermission = ({ permission, children }) => {
const permissions = useSelector((state) => state.auth.permissions);

const isAllowed = permissions?.includes(permission);

if (!isAllowed) {
  return <Navigate to="/403" replace />;
}

return children;
};

export default RequirePermission;