import React, { useEffect, useState } from "react";
import api from "../../config/api.config";
import toast from "react-hot-toast";
import { LoadingSpinner, EmptyState, DataTable } from "../common/DashboardShared";
import { MdBlock, MdCheckCircle } from "react-icons/md";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await api.get("/admin/customers");
      setCustomers(res.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    const nextActive = !user.profile.isActive;
    const nextStatus = nextActive ? "verified" : "suspended";
    try {
      await api.patch(`/admin/customers/${user._id}/status`, {
        isActive: nextActive,
        status: nextStatus,
      });
      toast.success("Customer status updated successfully");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner message="Loading customer accounts..." />;

  return (
    <div className="overflow-y-auto h-full p-2">
      <h2 className="text-2xl font-bold mb-6 text-(--color-base-content)">Customers List</h2>

      {customers.length === 0 ? (
        <EmptyState message="No customers found." />
      ) : (
        <DataTable headers={["Photo", "Customer Name", "Email", "Phone", "Status", "Actions"]}>
          {customers.map((user) => (
            <tr key={user._id} className="border-b border-(--color-base-300)">
              <td className="px-6 py-4">
                <img
                  src={user.photo?.url || "https://placehold.co/600x400?text=User"}
                  alt={user.fullName}
                  className="w-10 h-10 rounded-full object-cover border border-(--color-base-300)"
                />
              </td>
              <td className="px-6 py-4 font-bold">{user.fullName}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
              <td className="px-6 py-4 text-xs font-semibold">{user.phone}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${user.profile?.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {user.profile?.isActive ? "Active" : "Suspended"}
                </span>
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleToggleStatus(user)}
                  className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                    user.profile?.isActive
                      ? "bg-red-50 hover:bg-red-100 text-red-600"
                      : "bg-green-50 hover:bg-green-100 text-green-600"
                  }`}
                  title={user.profile?.isActive ? "Suspend User" : "Activate User"}
                >
                  {user.profile?.isActive ? (
                    <>
                      <MdBlock /> Suspend
                    </>
                  ) : (
                    <>
                      <MdCheckCircle /> Activate
                    </>
                  )}
                </button>
              </td>
            </tr>
          ))}
        </DataTable>
      )}
    </div>
  );
};

export default AdminCustomers;
