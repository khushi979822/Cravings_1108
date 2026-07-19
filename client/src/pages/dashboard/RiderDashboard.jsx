import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import RiderSidebar from "../../components/riderDashboard/RiderSidebar";
import RiderOverview from "../../components/riderDashboard/RiderOverview";
import RiderOrders from "../../components/riderDashboard/RiderOrders";
import RiderSetting from "../../components/riderDashboard/RiderSettings";

const RiderDashboard = () => {
  const auth = useAuth();
  const isLogin = auth?.isLogin ?? false;
  const role = auth?.role ?? null;
  const navigate = useNavigate();
  const active = useLocation().state?.activeTab;
  const [activeTab, setActiveTab] = React.useState(active || "overview");

  if (!isLogin || role !== "rider") {
    return (
      <div className="h-[92vh] bg-[url('/foodTable.webp')]  bg-cover bg-center">
        <div className="h-full backdrop-blur-lg flex flex-col items-center justify-center ">
          <h1 className="text-2xl font-bold text-(--color-neutral-content)">
            Access Denied. Please log in as a Rider to view this page.
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
        <RiderSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className="w-4/5 bg-white p-6 rounded-xl shadow-sm border border-(--color-base-300) min-h-[85vh]">
        {activeTab === "overview" && <RiderOverview />}
        {activeTab === "orders" && <RiderOrders />}
        {activeTab === "settings" && <RiderSetting />}
      </div>
    </div>
  );
};

export default RiderDashboard;
