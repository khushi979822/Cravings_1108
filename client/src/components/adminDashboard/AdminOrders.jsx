import React, { useEffect, useState } from "react";
import api from "../../config/api.config";
import toast from "react-hot-toast";
import { LoadingSpinner, EmptyState, DataTable, StatusBadge } from "../common/DashboardShared";
import { MdOutlineClose, MdAssignmentInd } from "react-icons/md";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Assign Rider modal state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [riders, setRiders] = useState([]);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedRiderId, setSelectedRiderId] = useState("");

  const fetchData = async () => {
    try {
      const res = await api.get(`/admin/orders?status=${statusFilter}&search=${searchQuery}`);
      setOrders(res.data.data || []);
      
      const riderRes = await api.get("/admin/riders");
      setRiders(riderRes.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      toast.success("Order status updated");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const openAssignModal = (order) => {
    setSelectedOrder(order);
    setSelectedRiderId(order.riderId?._id || "");
    setAssignModalOpen(true);
  };

  const handleAssignRiderSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/admin/orders/${selectedOrder._id}/assign-rider`, { riderId: selectedRiderId });
      toast.success("Rider assigned successfully");
      setAssignModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to assign rider");
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter, searchQuery]);

  if (loading) return <LoadingSpinner message="Loading orders..." />;

  return (
    <div className="overflow-y-auto h-full p-2">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-(--color-base-content)">Manage Orders</h2>
        
        {/* Filters */}
        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by Order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-(--color-base-300) rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 flex-1"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-(--color-base-300) rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="pickedUp">Picked Up</option>
            <option value="outForDelivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {orders.length === 0 ? (
        <EmptyState message="No orders matched your filters." />
      ) : (
        <DataTable headers={["Order ID", "Restaurant", "Amount", "Rider", "Status", "Actions"]}>
          {orders.map((order) => (
            <tr key={order._id} className="border-b border-(--color-base-300) text-xs">
              <td className="px-6 py-4 font-mono font-bold">{order._id}</td>
              <td className="px-6 py-4 font-semibold text-gray-800">{order.restaurantId?.restaurantName}</td>
              <td className="px-6 py-4 font-bold text-orange-700">₹{order.billDetails?.finalAmount}</td>
              <td className="px-6 py-4 text-gray-600 font-semibold">{order.riderId?.riderId?.fullName || "Not Assigned"}</td>
              <td className="px-6 py-4">
                <StatusBadge status={order.orderStatus} />
              </td>
              <td className="px-6 py-4 flex gap-2 items-center">
                <select
                  value={order.orderStatus}
                  onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                  className="border border-gray-300 rounded text-xs p-1"
                >
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready</option>
                  <option value="pickedUp">Picked Up</option>
                  <option value="outForDelivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button
                  onClick={() => openAssignModal(order)}
                  className="bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 px-2 py-1 rounded font-semibold text-[10px] flex items-center gap-1 transition"
                  title="Assign Rider"
                >
                  <MdAssignmentInd /> Assign Rider
                </button>
              </td>
            </tr>
          ))}
        </DataTable>
      )}

      {/* Assign Rider Modal */}
      {assignModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <form onSubmit={handleAssignRiderSubmit} className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
            <button
              type="button"
              onClick={() => setAssignModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-700"
            >
              <MdOutlineClose className="text-2xl" />
            </button>
            <h3 className="font-bold text-lg mb-4 text-(--color-base-content)">Assign Rider</h3>
            <p className="text-xs text-gray-500 mb-4">Select a rider to assign to order ID: <span className="font-mono font-bold text-gray-700">{selectedOrder._id}</span></p>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold block mb-1">Available Riders</label>
                <select
                  value={selectedRiderId}
                  onChange={(e) => setSelectedRiderId(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-(--color-base-300) rounded bg-white text-sm"
                >
                  <option value="">Select Rider...</option>
                  {riders.map(r => (
                    <option key={r.profile?._id || r._id} value={r.profile?._id || r._id}>
                      {r.fullName} ({r.profile?.isAvailable ? "Online" : "Offline"})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setAssignModalOpen(false)}
                className="px-4 py-2 border border-(--color-base-300) rounded-lg text-sm bg-white font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-(--color-primary) text-white rounded-lg text-sm font-semibold hover:opacity-90"
              >
                Assign
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
