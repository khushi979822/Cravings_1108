import React, { useEffect, useState } from "react";
import api from "../../config/api.config";
import toast from "react-hot-toast";
import { LoadingSpinner, StatCard, StatusBadge } from "../common/DashboardShared";
import { MdShoppingCart, MdDoneAll, MdOutlineClose, MdAttachMoney } from "react-icons/md";

const CustomerOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await api.get("/customer/dashboard");
      setStats(res.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner message="Loading dashboard statistics..." />;
  if (!stats) return <div className="text-center py-10 text-red-500">Failed to load statistics.</div>;

  const orderStatuses = [
    "pending",
    "accepted",
    "preparing",
    "ready",
    "pickedUp",
    "outForDelivery",
    "delivered"
  ];

  const getTimelineStep = (currentStatus) => {
    const idx = orderStatuses.indexOf(currentStatus);
    return idx === -1 ? 0 : idx;
  };

  const activeStep = stats.activeOrder ? getTimelineStep(stats.activeOrder.orderStatus) : 0;

  return (
    <div className="overflow-y-auto h-full space-y-6">
      {/* Welcome header */}
      <div className="bg-gradient-to-r from-orange-700 to-orange-500 p-6 rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-4">
          <img
            src={stats.photo?.url || "https://placehold.co/600x400?text=User"}
            alt={stats.customerName}
            className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
          />
          <div>
            <h2 className="text-2xl font-bold">Welcome back, {stats.customerName}!</h2>
            <p className="text-white/80 text-sm">Delicious food is just a few clicks away.</p>
          </div>
        </div>
        <div className="bg-white/10 px-4 py-2 rounded-xl text-center backdrop-blur-xs">
          <span className="text-xs uppercase tracking-wider text-white/70 block">Total Spent</span>
          <span className="text-xl font-bold">₹{stats.totalAmountSpent}</span>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Orders" value={stats.totalOrders} icon={<MdShoppingCart />} />
        <StatCard title="Active Orders" value={stats.activeOrder ? 1 : 0} icon={<MdShoppingCart />} />
        <StatCard title="Delivered Orders" value={stats.deliveredOrders} icon={<MdDoneAll />} />
        <StatCard title="Cancelled Orders" value={stats.cancelledOrders} icon={<MdOutlineClose />} />
      </div>

      {/* Active Order Tracker */}
      {stats.activeOrder && (
        <div className="bg-(--color-base-200) p-6 rounded-2xl border border-(--color-base-300) shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-(--color-base-content)">Active Order Tracking ({stats.activeOrder._id})</h3>
            <StatusBadge status={stats.activeOrder.orderStatus} />
          </div>
          
          {/* Tracking timeline */}
          <div className="relative flex justify-between items-center w-full max-w-3xl mx-auto my-6">
            <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-300 -translate-y-1/2 -z-0"></div>
            <div
              className="absolute left-0 top-1/2 h-1 bg-orange-600 -translate-y-1/2 transition-all duration-500 -z-0"
              style={{ width: `${(activeStep / (orderStatuses.length - 1)) * 100}%` }}
            ></div>

            {orderStatuses.map((step, index) => (
              <div key={index} className="flex flex-col items-center z-10 relative">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition ${
                    index <= activeStep
                      ? "bg-orange-700 border-orange-700 text-white"
                      : "bg-white border-gray-300 text-gray-500"
                  }`}
                >
                  {index + 1}
                </div>
                <span className="text-[10px] md:text-xs font-semibold capitalize text-gray-600 mt-2 bg-white px-1">
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Coupons */}
      {stats.availableCoupons && stats.availableCoupons.length > 0 && (
        <div className="bg-white p-5 rounded-2xl border border-(--color-base-300) shadow-sm">
          <h3 className="font-bold text-lg text-(--color-base-content) mb-3">Available Coupons & Offers</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.availableCoupons.map((coupon) => (
              <div key={coupon._id} className="bg-orange-50 border border-dashed border-orange-300 p-4 rounded-xl flex justify-between items-center">
                <div>
                  <span className="text-xs text-orange-600 uppercase font-bold tracking-wider">{coupon.discountType === "percentage" ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} FLAT OFF`}</span>
                  <h4 className="font-extrabold text-lg text-orange-800 mt-1">{coupon.code}</h4>
                  <p className="text-[10px] text-orange-700 mt-1">Min Order: ₹{coupon.minOrderAmount}</p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(coupon.code);
                    toast.success("Coupon code copied!");
                  }}
                  className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders, Favorite Items, and Notifications lists */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="bg-white p-5 rounded-2xl border border-(--color-base-300) shadow-sm">
          <h3 className="font-bold text-lg text-(--color-base-content) mb-3">Recent Orders</h3>
          {stats.recentOrders.length === 0 ? (
            <p className="text-sm text-gray-500">No recent orders yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.recentOrders.map(order => (
                <div key={order._id} className="flex justify-between items-center p-3 border border-(--color-base-300) rounded-xl hover:bg-gray-50 transition">
                  <div>
                    <h4 className="font-bold text-sm">{order.restaurantId?.restaurantName || "Restaurant"}</h4>
                    <p className="text-xs text-gray-500 mt-1">₹{order.billDetails?.finalAmount} • {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <StatusBadge status={order.orderStatus} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="bg-white p-5 rounded-2xl border border-(--color-base-300) shadow-sm">
          <h3 className="font-bold text-lg text-(--color-base-content) mb-3">Notifications</h3>
          {stats.notifications.length === 0 ? (
            <p className="text-sm text-gray-500">No new notifications.</p>
          ) : (
            <div className="space-y-3">
              {stats.notifications.map(notif => (
                <div key={notif._id} className="p-3 border border-(--color-base-300) rounded-xl bg-gray-50/50">
                  <h4 className="font-bold text-xs text-gray-800">{notif.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                  <span className="text-[10px] text-gray-400 block mt-1">{new Date(notif.createdAt).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerOverview;
