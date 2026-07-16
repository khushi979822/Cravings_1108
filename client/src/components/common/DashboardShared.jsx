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

export const DashboardCard = ({ title, children, action }) => (
  <div className="bg-(--color-base-100) rounded-xl border border-(--color-base-300) shadow-sm overflow-hidden">
    <div className="px-5 py-4 border-b border-(--color-base-300) flex justify-between items-center bg-(--color-base-200)/30">
      <h3 className="font-bold text-lg text-(--color-base-content)">{title}</h3>
      {action && <div>{action}</div>}
    </div>
    <div className="p-5">{children}</div>
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

export const SearchBar = ({ value, onChange, placeholder = "Search..." }) => (
  <div className="relative flex-1">
    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">🔍</span>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full pl-9 pr-4 py-2 border border-(--color-base-300) rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-sm"
    />
  </div>
);

export const FilterBar = ({ selected, options, onChange }) => (
  <select
    value={selected}
    onChange={(e) => onChange(e.target.value)}
    className="border border-(--color-base-300) rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
  >
    {options.map((opt, i) => (
      <option key={i} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-between items-center mt-4">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-1 bg-white border border-(--color-base-300) text-(--color-base-content) rounded-lg disabled:opacity-50 text-sm font-medium"
      >
        Previous
      </button>
      <span className="text-sm font-medium text-(--color-secondary)">
        Page {currentPage} of {totalPages}
      </span>
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1 bg-white border border-(--color-base-300) text-(--color-base-content) rounded-lg disabled:opacity-50 text-sm font-medium"
      >
        Next
      </button>
    </div>
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

export const ErrorState = ({ message = "Something went wrong.", onRetry }) => (
  <div className="text-center py-16 border border-(--color-error)/20 rounded-xl bg-red-50 text-red-700">
    <div className="text-4xl mb-3">⚠️</div>
    <h4 className="font-bold text-lg">Error occurred</h4>
    <p className="text-sm text-red-600/80 mt-1">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition"
      >
        Retry
      </button>
    )}
  </div>
);

export const ConfirmModal = ({ open, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel" }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 mx-4">
        <h3 className="text-lg font-bold text-(--color-base-content)">{title}</h3>
        <p className="text-sm text-(--color-secondary) mt-2">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-semibold transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-(--color-primary) hover:opacity-90 text-white rounded-lg text-sm font-semibold transition"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
