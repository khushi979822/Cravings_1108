import React, { useEffect, useState } from "react";
import api from "../../config/api.config";
import toast from "react-hot-toast";
import { LoadingSpinner, EmptyState, DataTable } from "../common/DashboardShared";

const RiderOrders = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/rider/delivery-history");
      setHistory(res.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load delivery history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  if (loading) return <LoadingSpinner message="Loading delivery history..." />;

  return (
    <div className="overflow-y-auto h-full p-2">
      <h2 className="text-2xl font-bold mb-6 text-(--color-base-content)">Delivery History</h2>
      {history.length === 0 ? (
        <EmptyState message="No completed deliveries yet." />
      ) : (
        <DataTable headers={["Order ID", "Restaurant", "Destination", "Delivery Date", "Amount Earned"]}>
          {history.map((order) => (
            <tr key={order._id} className="border-b border-(--color-base-300) text-sm">
              <td className="px-6 py-4 font-mono text-xs font-bold">{order._id}</td>
              <td className="px-6 py-4 font-semibold text-gray-800">{order.restaurantId?.restaurantName}</td>
              <td className="px-6 py-4 text-xs text-gray-500">
                {order.deliveryAddress?.name} <br />
                {order.deliveryAddress?.address}, {order.deliveryAddress?.city}
              </td>
              <td className="px-6 py-4 text-xs text-gray-500">{new Date(order.updatedAt).toLocaleDateString()}</td>
              <td className="px-6 py-4 font-bold text-green-600">₹{order.billDetails?.deliveryCharge || 45}</td>
            </tr>
          ))}
        </DataTable>
      )}
    </div>
  );
};

export default RiderOrders;
