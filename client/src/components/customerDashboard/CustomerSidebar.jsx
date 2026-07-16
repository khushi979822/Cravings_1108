import React from "react";
import { MdDashboard, MdOutlineLocationOn, MdFavoriteBorder, MdOutlineLocalOffer, MdNotificationsNone } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";

const CustomerSidebar = ({ activeTab, setActiveTab }) => {
  const mainTabs = [
    { name: "Dashboard", value: "overview", icon: <MdDashboard /> },
    { name: "My Orders", value: "orders", icon: <FaShoppingCart /> },
    { name: "Favorite Items", value: "favourites", icon: <MdFavoriteBorder /> },
    { name: "Saved Addresses", value: "addresses", icon: <MdOutlineLocationOn /> },
  ];

  const settingsTab = {
    name: "Profile & Settings",
    value: "settings",
    icon: <IoMdSettings />,
  };

  const renderTab = (tab) => (
    <li
      key={tab.value}
      className={`cursor-pointer p-2.5 rounded-lg text-(--color-base-content) flex items-center gap-3 transition-all ${
        activeTab === tab.value
          ? "bg-(--color-primary) text-(--color-primary-content) font-semibold shadow-sm"
          : "hover:bg-(--color-base-300) hover:text-(--color-primary) font-medium"
      }`}
      onClick={() => setActiveTab(tab.value)}
    >
      {tab.icon} {tab.name}
    </li>
  );

  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        <div className="mb-6 px-2 py-1">
          <h2 className="text-xl font-bold text-(--color-primary)">Cravings</h2>
          <p className="text-xs text-(--color-secondary)">Customer Dashboard</p>
        </div>
        <ul className="space-y-2 flex-1">
          {mainTabs.map((tab) => renderTab(tab))}
        </ul>
      </div>
      <ul className="space-y-2 border-t border-(--color-base-300) pt-4">
        {renderTab(settingsTab)}
      </ul>
    </div>
  );
};

export default CustomerSidebar;
