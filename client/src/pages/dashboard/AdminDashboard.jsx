import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminSetting from "../../components/adminDashboard/AdminSettings";
import AdminSidebar from "../../components/adminDashboard/AdminSidebar";
import AdminOverview from "../../components/adminDashboard/AdminOverview";
import AdminOrders from "../../components/adminDashboard/AdminOrders";
import AdminRestaurants from "../../components/adminDashboard/AdminRestaurants";
import AdminFoods from "../../components/adminDashboard/AdminFoods";
import AdminCategories from "../../components/adminDashboard/AdminCategories";
import AdminCustomers from "../../components/adminDashboard/AdminCustomers";
import AdminRiders from "../../components/adminDashboard/AdminRiders";
import AdminCoupons from "../../components/adminDashboard/AdminCoupons";

const AdminDashboard = () => {
  const auth = useAuth();
  const isLogin = auth?.isLogin ?? false;
  const role = auth?.role ?? null;
  const navigate = useNavigate();
  const active = useLocation().state?.activeTab;
  const [activeTab, setActiveTab] = React.useState(active || "overview");

  if (!isLogin || role !== "admin") {
    return (
      <div className="h-[92vh] bg-[url('/foodTable.webp')]  bg-cover bg-center">
        <div className="h-full backdrop-blur-lg flex flex-col items-center justify-center ">
          <h1 className="text-2xl font-bold text-(--color-neutral-content)">
            Access Denied. Please log in as a Admin to view this page.
          </h1>
          <button
            className="mt-4 px-4 py-2 bg-(--color-primary) text-white rounded-md font-semibold hover:opacity-90 transition"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[92vh] flex gap-4 p-4 bg-(--color-base-100)">
      <div className="w-1/5 bg-white p-4 rounded-xl shadow-sm border border-(--color-base-300) min-h-[85vh]">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className="w-4/5 bg-white p-6 rounded-xl shadow-sm border border-(--color-base-300) min-h-[85vh]">
        {activeTab === "overview" && <AdminOverview />}
        {activeTab === "orders" && <AdminOrders />}
        {activeTab === "restaurants" && <AdminRestaurants />}
        {activeTab === "foods" && <AdminFoods />}
        {activeTab === "categories" && <AdminCategories />}
        {activeTab === "customers" && <AdminCustomers />}
        {activeTab === "riders" && <AdminRiders />}
        {activeTab === "coupons" && <AdminCoupons />}
        {activeTab === "settings" && <AdminSetting />}
      </div>
    </div>
  );
};

export default AdminDashboard;
