import React, { useEffect, useState } from "react";
import api from "../../config/api.config";
import toast from "react-hot-toast";
import { LoadingSpinner, StatCard, StatusBadge, EmptyState } from "../common/DashboardShared";
import { MdDeliveryDining, MdAttachMoney } from "react-icons/md";

const RiderOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeOrder, setActiveOrder] = useState(null);
  const [toggling, setToggling] = useState(false);

  const fetchData = async () => {
    try {
      const statsRes = await api.get("/rider/dashboard");
      setStats(statsRes.data.data);

      const orderRes = await api.get("/rider/current-order");
      setActiveOrder(orderRes.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async () => {
    setToggling(true);
    try {
      const nextVal = !stats.isAvailable;
      await api.patch("/rider/availability", { isAvailable: nextVal });
      toast.success(nextVal ? "You are now online & available!" : "You are now offline.");
      setStats(prev => ({ ...prev, isAvailable: nextVal }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to toggle status");
    } finally {
      setToggling(false);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      await api.patch(`/rider/orders/${orderId}/accept`);
      toast.success("Delivery accepted successfully!");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to accept delivery");
    }
  };

  const handleUpdateStatus = async (status) => {
    try {
      await api.patch(`/rider/orders/${activeOrder._id}/status`, { status });
      toast.success(`Delivery status updated: ${status}`);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update delivery status");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner message="Loading Rider Dashboard..." />;
  if (!stats) return <div className="text-center py-10 text-red-500">Failed to load statistics.</div>;

  const orderStatuses = ["accepted", "preparing", "ready", "pickedUp", "outForDelivery", "delivered"];
  const activeStep = activeOrder ? orderStatuses.indexOf(activeOrder.orderStatus) : 0;

  return (
    <div className="overflow-y-auto h-full space-y-6">
      {/* Welcome header with online status */}
      <div className="bg-gradient-to-r from-orange-700 to-orange-500 p-6 rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <img
            src={stats.photo?.url || "https://placehold.co/600x400?text=Rider"}
            alt={stats.riderName}
            className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
          />
          <div>
            <h2 className="text-2xl font-bold">Hello, {stats.riderName}!</h2>
            <p className="text-white/80 text-sm">Your ratings: ⭐ {stats.averageRating.toFixed(1)}</p>
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="flex items-center gap-3 bg-white/10 px-4 py-2.5 rounded-xl backdrop-blur-xs">
          <span className="text-xs uppercase font-bold tracking-wider">{stats.isAvailable ? "Online" : "Offline"}</span>
          <button
            onClick={handleToggleAvailability}
            disabled={toggling}
            className={`w-12 h-6 rounded-full p-0.5 transition-colors relative ${stats.isAvailable ? "bg-green-500" : "bg-gray-400"}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${stats.isAvailable ? "translate-x-6" : "translate-x-0"}`} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Today's Deliveries" value={stats.todayCompletedDeliveriesCount} icon={<MdDeliveryDining />} />
        <StatCard title="Total Deliveries" value={stats.completedDeliveriesCount} icon={<MdDeliveryDining />} />
        <StatCard title="Today's Earnings" value={`₹${stats.todayEarnings}`} icon={<MdAttachMoney />} />
        <StatCard title="Total Earnings" value={`₹${stats.totalEarnings}`} icon={<MdAttachMoney />} />
      </div>

      {/* Active Delivery Flow */}
      {activeOrder ? (
        <div className="bg-(--color-base-200) p-6 rounded-2xl border border-(--color-base-300) shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-(--color-base-300) pb-2">
            <h3 className="font-bold text-lg text-gray-900">Current Active Delivery</h3>
            <StatusBadge status={activeOrder.orderStatus} />
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-xs">
            {/* Restaurant */}
            <div className="p-3 border border-gray-300 rounded-xl bg-white space-y-1">
              <h4 className="font-bold uppercase text-(--color-primary)">Pickup Restaurant</h4>
              <p className="font-bold text-sm">{activeOrder.restaurantId?.restaurantName}</p>
              <p className="text-gray-600">{activeOrder.restaurantId?.address}</p>
              {activeOrder.restaurantId?.contactDetails?.phone && (
                <p className="text-orange-700 font-semibold mt-1">📞 Call Restaurant: {activeOrder.restaurantId?.contactDetails?.phone}</p>
              )}
            </div>

            {/* Customer info */}
            <div className="p-3 border border-gray-300 rounded-xl bg-white space-y-1">
              <h4 className="font-bold uppercase text-(--color-primary)">Delivery Destination</h4>
              <p className="font-bold text-sm">{activeOrder.deliveryAddress?.name}</p>
              <p className="text-gray-600">{activeOrder.deliveryAddress?.address}, {activeOrder.deliveryAddress?.city}</p>
              <p className="text-orange-700 font-semibold mt-1">📞 Call Customer: 9798227499</p>
            </div>
          </div>

          {/* Tracking flow updates */}
          <div className="relative flex justify-between items-center w-full max-w-xl mx-auto my-6 pt-3">
            <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-300 -translate-y-1/2 -z-0"></div>
            <div
              className="absolute left-0 top-1/2 h-1 bg-orange-600 -translate-y-1/2 transition-all duration-500 -z-0"
              style={{ width: `${(activeStep / (orderStatuses.length - 1)) * 100}%` }}
            ></div>

            {orderStatuses.map((step, index) => (
              <div key={index} className="flex flex-col items-center z-10 relative">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs border-2 transition ${
                    index <= activeStep
                      ? "bg-orange-700 border-orange-700 text-white"
                      : "bg-white border-gray-300 text-gray-500"
                  }`}
                >
                  {index + 1}
                </div>
              </div>
            ))}
          </div>

          {/* Step Sequence Actions */}
          <div className="flex gap-2 justify-center pt-2">
            {activeOrder.orderStatus === "accepted" && (
              <button
                onClick={() => handleUpdateStatus("preparing")}
                className="bg-orange-700 text-white font-bold text-xs px-4 py-2 rounded-lg hover:bg-orange-600 transition"
              >
                Food Preparing
              </button>
            )}
            {activeOrder.orderStatus === "preparing" && (
              <button
                onClick={() => handleUpdateStatus("ready")}
                className="bg-orange-700 text-white font-bold text-xs px-4 py-2 rounded-lg hover:bg-orange-600 transition"
              >
                Ready for Pickup
              </button>
            )}
            {activeOrder.orderStatus === "ready" && (
              <button
                onClick={() => handleUpdateStatus("pickedUp")}
                className="bg-orange-700 text-white font-bold text-xs px-4 py-2 rounded-lg hover:bg-orange-600 transition"
              >
                Picked Up Food
              </button>
            )}
            {activeOrder.orderStatus === "pickedUp" && (
              <button
                onClick={() => handleUpdateStatus("outForDelivery")}
                className="bg-orange-700 text-white font-bold text-xs px-4 py-2 rounded-lg hover:bg-orange-600 transition"
              >
                Out for Delivery
              </button>
            )}
            {activeOrder.orderStatus === "outForDelivery" && (
              <button
                onClick={() => handleUpdateStatus("delivered")}
                className="bg-green-600 text-white font-bold text-xs px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Mark Delivered ✅
              </button>
            )}
            
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${activeOrder.deliveryAddress?.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-gray-300 text-gray-700 font-bold text-xs px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-1 transition"
            >
              📍 Open Map location
            </a>
          </div>
        </div>
      ) : (
        /* Available requests list when online */
        <div className="bg-white p-5 rounded-2xl border border-(--color-base-300) shadow-sm">
          <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
            🔔 Available Delivery Requests
          </h3>

          {!stats.isAvailable ? (
            <p className="text-sm text-gray-500">Go online to view and accept delivery requests.</p>
          ) : stats.availableRequests?.length === 0 ? (
            <p className="text-sm text-gray-500">No active delivery requests right now. Check back soon!</p>
          ) : (
            <div className="space-y-4">
              {stats.availableRequests?.map((req) => (
                <div key={req._id} className="p-4 border border-(--color-base-300) rounded-xl bg-gray-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h4 className="font-bold text-base text-gray-800">{req.restaurantId?.restaurantName || "Restaurant"}</h4>
                    <p className="text-xs text-gray-500 mt-1">To: {req.deliveryAddress?.name} ({req.deliveryAddress?.city})</p>
                    <span className="inline-block mt-2 font-bold text-sm text-(--color-primary)">Est. Earnings: ₹45</span>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <button
                      onClick={() => handleAcceptOrder(req._id)}
                      className="flex-1 md:flex-none bg-orange-700 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2 rounded-lg transition"
                    >
                      Accept Delivery
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RiderOverview;
