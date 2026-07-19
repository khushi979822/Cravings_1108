import React from "react";

export const StatCard = ({ title, value, icon, description, trend }) => (
  <div className="bg-(--color-base-200) p-5 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-between border border-(--color-base-300)">
    <div>
      <p className="text-sm font-medium text-(--color-secondary) uppercase tracking-wider">{title}</p>
      <h3 className="text-3xl font-bold text-(--color-base-content) mt-1">{value}</h3>
      {description && <p className="text-xs text-(--color-secondary) mt-1">{description}</p>}
      {trend && (
        <span className={`text-xs font-semibold mt-2 inline-block ${trend.startsWith("+") ? "text-green-600" : "text-red-500"}`}>
          {trend}
        </span>
      )}
    </div>
    <div className="text-3xl text-(--color-primary) bg-(--color-primary)/10 p-3 rounded-lg">
      {icon}
    </div>
  </div>
);



export const DataTable = ({ headers, children, emptyMessage = "No items found." }) => (
  <div className="overflow-x-auto rounded-lg border border-(--color-base-300) bg-white">
    <table className="min-w-full divide-y divide-(--color-base-300)">
      <thead className="bg-(--color-base-200)/40">
        <tr>
          {headers.map((h, i) => (
            <th key={i} className="px-6 py-3 text-left text-xs font-semibold text-(--color-base-content) uppercase tracking-wider">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-(--color-base-300) text-sm text-(--color-base-content)">
        {children || (
          <tr>
            <td colSpan={headers.length} className="px-6 py-10 text-center text-(--color-secondary)">
              {emptyMessage}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export const StatusBadge = ({ status }) => {
  const getColors = (s) => {
    switch (s?.toLowerCase()) {
      case "delivered":
      case "completed":
      case "active":
      case "verified":
      case "online":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
      case "preparing":
      case "ready":
      case "accepted":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "pickedup":
      case "ontheway":
      case "outfordelivery":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
      case "failed":
      case "rejected":
      case "blocked":
      case "suspended":
      case "offline":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getColors(status)}`}>
      {status}
    </span>
  );
};



export const LoadingSpinner = ({ message = "Loading data..." }) => (
  <div className="flex flex-col justify-center items-center py-16">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-(--color-primary) mb-3"></div>
    <p className="text-sm text-(--color-secondary) font-medium animate-pulse">{message}</p>
  </div>
);

export const EmptyState = ({ message = "No records found.", action }) => (
  <div className="text-center py-16 border border-dashed border-(--color-base-300) rounded-xl bg-(--color-base-100)">
    <div className="text-4xl mb-3">📭</div>
    <p className="text-base text-(--color-secondary) font-medium">{message}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);


