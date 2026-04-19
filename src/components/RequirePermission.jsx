import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RequirePermission = ({ permission, children }) => {
    .log("permission", permission);
const permissions = useSelector((state) => state.auth.permissions);
  .log("permissions", permissions);

const isAllowed = permissions?.includes(permission);
  .log("isAllowed", isAllowed);

if (!isAllowed) {
  return <Navigate to="/403" replace />;
}

return children;
};

export default RequirePermission;