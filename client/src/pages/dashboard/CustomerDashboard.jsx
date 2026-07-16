import React from "react";
import Sidebar from "../../components/customerDashboard/CustomerSidebar";
import CustomerOverview from "../../components/customerDashboard/CustomerOverview";
import CustomerOrders from "../../components/customerDashboard/CustomerOrders";
import CustomerSetting from "../../components/customerDashboard/CustomerSettings";
import WishList from "../../components/customerDashboard/WishList";
import AddressBook from "../../components/customerDashboard/AddressBook";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const CustomerDashboard = () => {
  const auth = useAuth();
  const isLogin = auth?.isLogin ?? false;
  const role = auth?.role ?? null;
  const navigate = useNavigate();
  const active = useLocation().state?.activeTab;
  const [activeTab, setActiveTab] = React.useState(active || "overview");

  if (!isLogin || role !== "customer") {
    return (
      <div className="h-[92vh] bg-[url('/foodTable.webp')]  bg-cover bg-center">
        <div className="h-full backdrop-blur-lg flex flex-col items-center justify-center ">
          <h1 className="text-2xl font-bold text-(--color-neutral-content)">
            Access Denied. Please log in as a customer to view this page.
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
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className="w-4/5 bg-white p-6 rounded-xl shadow-sm border border-(--color-base-300) min-h-[85vh]">
        {activeTab === "overview" && <CustomerOverview />}
        {activeTab === "orders" && <CustomerOrders />}
        {activeTab === "favourites" && <WishList />}
        {activeTab === "addresses" && <AddressBook />}
        {activeTab === "settings" && <CustomerSetting />}
      </div>
    </div>
  );
};

export default CustomerDashboard;
