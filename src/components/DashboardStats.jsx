import React from "react";

const DashboardStats = ({ stats = [] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {stats.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex items-center justify-between hover:shadow-md transition"
          >
            <div>
              <p className="text-sm text-slate-500">{item.title}</p>
              <h2 className="text-2xl font-bold text-slate-800 mt-1">
                {item.value}
              </h2>
            </div>

            <div
              className={`w-12 h-12 flex items-center justify-center rounded-xl text-white ${item.color}`}
            >
              <Icon size={22} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;