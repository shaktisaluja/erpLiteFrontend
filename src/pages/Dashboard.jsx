import React, { useEffect, useMemo, useState } from "react";
import { Users, Building2, Shield, MapPin, Layers, Activity } from "lucide-react";
import toast from "react-hot-toast";
import DashboardStats from "../components/DashboardStats";
import dashboardApi from "../api/dashboardApi";

const recentActivities = [
  { action: "User Created", user: "John Doe", time: "2 mins ago" },
  { action: "Role Updated", user: "Admin", time: "10 mins ago" },
  { action: "Site Added", user: "Manager", time: "30 mins ago" }
];

const recentUsers = [
  { name: "Aman Sharma", email: "aman@mail.com" },
  { name: "Priya Verma", email: "priya@mail.com" },
  { name: "Rahul Singh", email: "rahul@mail.com" }
];

const getDashboardPayload = (responseData) =>
  responseData?.data || responseData || {};

const getCount = (payload, keys) => {
  for (const key of keys) {
    const value = payload?.[key];
    if (typeof value === "number") {
      return value;
    }
  }

  return 0;
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({});

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await dashboardApi.getDashboardStatsApi();
        .log("res of fetching dashboard stats", res);
  setDashboardData(getDashboardPayload(res?.data));

} catch (error) {
  const message =
    error?.response?.data?.message ||
    error?.message ||
    "Failed to fetch dashboard stats";
  toast.error(message);
}
    };

fetchDashboardStats();
  }, []);

const stats = useMemo(() => [
  {
    title: "Total Organizations",
    value: getCount(dashboardData, [
      "totalOrganizations",
      "organizationCount",
      "organizationsCount",
      "organizations"
    ]),
    icon: Building2,
    color: "bg-blue-500"
  },
  {
    title: "Total Users",
    value: getCount(dashboardData, [
      "totalUsers",
      "userCount",
      "usersCount",
      "users"
    ]),
    icon: Users,
    color: "bg-indigo-500"
  },
  {
    title: "Active Users",
    value: getCount(dashboardData, [
      "activeUsers",
      "activeUserCount",
      "activeUsersCount"
    ]),
    icon: Users,
    color: "bg-green-500"
  },
  {
    title: "Total Roles",
    value: getCount(dashboardData, [
      "totalRoles",
      "roleCount",
      "rolesCount",
      "roles"
    ]),
    icon: Shield,
    color: "bg-purple-500"
  },
  {
    title: "Total Sites",
    value: getCount(dashboardData, [
      "totalSites",
      "siteCount",
      "sitesCount",
      "sites"
    ]),
    icon: MapPin,
    color: "bg-pink-500"
  },
  {
    title: "Total Departments",
    value: getCount(dashboardData, [
      "totalDepartments",
      "departmentCount",
      "departmentsCount",
      "departments"
    ]),
    icon: Layers,
    color: "bg-orange-500"
  }
], [dashboardData]);

return (
  <div className="space-y-6">

    {/* 🔥 Page Title */}
    <div>
      <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
      <p className="text-sm text-slate-500">Overview of your ERP system</p>
    </div>

    {/* 📊 Stats Grid */}
    <DashboardStats stats={stats} />

    {/* 🔥 Bottom Section */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

      {/* 📜 Recent Activities */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="text-indigo-600" size={20} />
          <h2 className="font-semibold text-slate-800">Recent Activities</h2>
        </div>

        <div className="space-y-3">
          {recentActivities.map((item, i) => (
            <div
              key={i}
              className="flex justify-between items-center p-3 bg-slate-50 rounded-lg"
            >
              <div>
                <p className="text-sm font-medium text-slate-700">
                  {item.action}
                </p>
                <p className="text-xs text-slate-500">{item.user}</p>
              </div>
              <span className="text-xs text-slate-400">{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 👥 Recent Users */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Users className="text-indigo-600" size={20} />
          <h2 className="font-semibold text-slate-800">Recent Users</h2>
        </div>

        <div className="space-y-3">
          {recentUsers.map((user, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
            >
              <div>
                <p className="text-sm font-medium text-slate-700">
                  {user.name}
                </p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>

              <div className="w-8 h-8 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-full font-semibold text-sm">
                {user.name.charAt(0)}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  </div>
);
};

export default Dashboard;
