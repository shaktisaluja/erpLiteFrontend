import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import User from "../pages/User";
import Roles from "../pages/Roles";
import Department from "../pages/Department";
import Sites from "../pages/Sites";
import Organizations from "../pages/Organization";
import Activity from "../pages/ActivityLog";
import ProtectedRoute from "../components/ProtectedRoute";
import Layout from "../components/Layout";
import { createBrowserRouter } from "react-router-dom";
import RequirePermission from "../components/RequirePermission";
import { ROUTE_PERMISSIONS } from "../constants/routesPermission";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: (
          <RequirePermission permission={ROUTE_PERMISSIONS.dashboard}>
            <Dashboard />
          </RequirePermission>
        )
      },
      {
        path: "user",
        element: (
          <RequirePermission permission={ROUTE_PERMISSIONS.user}>
            <User />
          </RequirePermission>
        )
      },
      {
        path: "roles",
        element: (
          <RequirePermission permission={ROUTE_PERMISSIONS.roles}>
            <Roles />
          </RequirePermission>
        )
      },
      {
        path: "department",
        element: (
          <RequirePermission permission={ROUTE_PERMISSIONS.department}>
            <Department />
          </RequirePermission>
        )
      },
      {
        path: "sites",
        element: (
          <RequirePermission permission={ROUTE_PERMISSIONS.sites}>
            <Sites />
          </RequirePermission>
        )
      },
      {
        path: "organizations",
        element: (
          <RequirePermission permission={ROUTE_PERMISSIONS.organizations}>
            <Organizations />
          </RequirePermission>
        )
      },
      {
        path: "activity",
        element: (
          <RequirePermission permission={ROUTE_PERMISSIONS.activity}>
            <Activity />
          </RequirePermission>
        )
      }
    ]
  }
]);


export default router;
