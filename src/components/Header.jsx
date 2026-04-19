import React from "react";
import { LayoutDashboard, Users, Shield, Building2, MapPin, Activity, Layers3, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard", permission: "DASHBOARD_VIEW" },
  { name: "Users", icon: Users, path: "/user", permission: "USER_VIEW" },
  { name: "Roles", icon: Shield, path: "/roles", permission: "ROLE_VIEW" },
  { name: "Departments", icon: Layers3, path: "/department", permission: "DEPARTMENT_VIEW" },
  { name: "Sites", icon: MapPin, path: "/sites", permission: "SITE_VIEW" },
  { name: "Organizations", icon: Building2, path: "/organizations", permission: "ORG_VIEW" },
  { name: "Activity Log", icon: Activity, path: "/activity", permission: "ACTIVITY_VIEW" },
];


const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const permissions = useSelector((state) => state.auth.permissions);
  const organizationLabel = user?.organizationName || "No Organization";
  const roleLabel = user?.role || "No Role";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="w-full bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
            ERP
          </div>
          <span className="font-semibold text-slate-800 text-lg">
            ERP Lite
          </span>
        </div>

        {/* Menu */}
        <nav className="flex items-center gap-2">
          {menuItems
          .filter((item) => permissions?.includes(item.permission))
          .map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`
                }
              >
                <Icon size={16} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Right Side (Profile placeholder) */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-right">
            <p className="text-sm font-semibold text-slate-800">{organizationLabel}</p>
            <p className="text-xs text-slate-500">{roleLabel}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900"
          >
            <LogOut size={16} />
            Logout
          </button>
          <div className="w-9 h-9 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold">
            {user?.role?.charAt(0)?.toUpperCase() || "U"}
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;
