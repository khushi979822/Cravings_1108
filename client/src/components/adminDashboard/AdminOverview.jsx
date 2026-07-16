import React, { useEffect, useState } from "react";
import api from "../../config/api.config";
import toast from "react-hot-toast";
import { LoadingSpinner, StatCard } from "../common/DashboardShared";
import { MdPeople, MdDeliveryDining, MdOutlineRestaurant, MdShoppingCart, MdAttachMoney, MdShowChart } from "react-icons/md";

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/dashboard");
      setStats(res.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner message="Loading analytics..." />;
  if (!stats) return <div className="text-center py-10 text-red-500">Failed to load statistics.</div>;

  return (
    <div className="overflow-y-auto h-full space-y-6">
      <h2 className="text-2xl font-bold text-(--color-base-content)">Admin Dashboard Overview</h2>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Customers" value={stats.totalCustomers} icon={<MdPeople />} />
        <StatCard title="Total Riders" value={stats.totalRiders} icon={<MdDeliveryDining />} />
        <StatCard title="Restaurants" value={stats.totalRestaurants} icon={<MdOutlineRestaurant />} />
        <StatCard title="Total Orders" value={stats.totalOrders} icon={<MdShoppingCart />} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Pending Orders" value={stats.pendingOrders} icon={<MdShoppingCart />} />
        <StatCard title="Active Orders" value={stats.activeOrders} icon={<MdShoppingCart />} />
        <StatCard title="Delivered Orders" value={stats.deliveredOrders} icon={<MdShoppingCart />} />
        <StatCard title="Cancelled Orders" value={stats.cancelledOrders} icon={<MdShoppingCart />} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={`₹${stats.totalRevenue}`} icon={<MdAttachMoney />} />
        <StatCard title="Today's Revenue" value={`₹${stats.todayRevenue}`} icon={<MdAttachMoney />} />
        <StatCard title="Monthly Revenue" value={`₹${stats.monthlyRevenue}`} icon={<MdAttachMoney />} />
        <StatCard title="Avg Order Value" value={`₹${stats.averageOrderValue.toFixed(1)}`} icon={<MdAttachMoney />} />
      </div>

      {/* SVG Order Growth Chart */}
      <div className="bg-(--color-base-200) p-5 rounded-xl border border-(--color-base-300) shadow-sm">
        <h3 className="font-bold text-lg text-(--color-base-content) mb-4 flex items-center gap-2">
          <MdShowChart className="text-(--color-primary) text-2xl" /> Weekly Order Trends
        </h3>
        <div className="flex items-end justify-between h-48 px-4 border-b border-gray-300">
          {stats.dailyOrders?.map((day, idx) => (
            <div key={idx} className="flex flex-col items-center flex-1 gap-2">
              <span className="text-xs font-bold text-orange-700">{day.orders}</span>
              <div
                className="w-10 bg-orange-700 hover:bg-orange-600 rounded-t-md transition-all duration-500"
                style={{ height: `${Math.max((day.orders / 25) * 120, 10)}px` }}
              ></div>
              <span className="text-xs text-gray-500">{day.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
