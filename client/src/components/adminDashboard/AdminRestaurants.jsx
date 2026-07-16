import React, { useEffect, useState } from "react";
import api from "../../config/api.config";
import toast from "react-hot-toast";
import { LoadingSpinner, EmptyState, DataTable } from "../common/DashboardShared";
import { MdDeleteOutline, MdToggleOn, MdToggleOff } from "react-icons/md";

const AdminRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [managers, setManagers] = useState([]);
  const [formData, setFormData] = useState({
    managerId: "",
    restaurantName: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    country: "India",
    cuisineTypes: "",
    restaurantType: "both",
    description: "",
  });

  const fetchData = async () => {
    try {
      const res = await api.get("/admin/restaurants");
      setRestaurants(res.data.data || []);
      
      // Load user accounts for dropdown (to assign manager)
      const custRes = await api.get("/admin/customers");
      setManagers(custRes.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (restaurant) => {
    const newStatus = restaurant.status === "active" ? "inactive" : "active";
    try {
      await api.patch(`/admin/restaurants/${restaurant._id}`, { status: newStatus });
      toast.success("Status updated successfully");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this restaurant?")) return;
    try {
      await api.delete(`/admin/restaurants/${id}`);
      toast.success("Restaurant deleted successfully");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/restaurants", formData);
      toast.success("Restaurant created successfully");
      setShowForm(false);
      setFormData({
        managerId: "",
        restaurantName: "",
        address: "",
        city: "",
        state: "",
        pinCode: "",
        country: "India",
        cuisineTypes: "",
        restaurantType: "both",
        description: "",
      });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create restaurant");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner message="Loading restaurants..." />;

  return (
    <div className="overflow-y-auto h-full p-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-(--color-base-content)">Manage Restaurants</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-(--color-primary) text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition text-sm"
          >
            + Add Restaurant
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-(--color-base-200) p-5 rounded-xl border border-(--color-base-300) mb-6 space-y-4 max-w-2xl">
          <h3 className="font-bold text-lg">New Restaurant Profile</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold block mb-1">Select Manager User Account</label>
              <select
                name="managerId"
                value={formData.managerId}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-(--color-base-300) rounded bg-white"
              >
                <option value="">Choose Manager...</option>
                {managers.map(u => (
                  <option key={u._id} value={u._id}>{u.fullName} ({u.email})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1">Restaurant Name</label>
              <input
                type="text"
                name="restaurantName"
                value={formData.restaurantName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-(--color-base-300) rounded bg-white"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold block mb-1">Restaurant Type</label>
              <select
                name="restaurantType"
                value={formData.restaurantType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-(--color-base-300) rounded bg-white"
              >
                <option value="veg">Veg</option>
                <option value="non-veg">Non-Veg</option>
                <option value="both">Both (Veg & Non-Veg)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1">Cuisines (comma separated)</label>
              <input
                type="text"
                name="cuisineTypes"
                placeholder="e.g. Indian, Chinese, Italian"
                value={formData.cuisineTypes}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-(--color-base-300) rounded bg-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1">Street Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-(--color-base-300) rounded bg-white"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold block mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-(--color-base-300) rounded bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-(--color-base-300) rounded bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1">Pin Code</label>
              <input
                type="text"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-(--color-base-300) rounded bg-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="2"
              className="w-full px-3 py-2 border border-(--color-base-300) rounded bg-white resize-none"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-(--color-base-300) rounded-lg text-sm bg-white font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-(--color-primary) text-white rounded-lg text-sm font-semibold hover:opacity-90"
            >
              Add Restaurant
            </button>
          </div>
        </form>
      )}

      {restaurants.length === 0 ? (
        <EmptyState message="No restaurants found." />
      ) : (
        <DataTable headers={["Restaurant Name", "Address", "Type", "Status", "Actions"]}>
          {restaurants.map((rest) => (
            <tr key={rest._id} className="border-b border-(--color-base-300)">
              <td className="px-6 py-4 font-bold">{rest.restaurantName}</td>
              <td className="px-6 py-4 text-xs text-gray-500">{rest.address}, {rest.city}</td>
              <td className="px-6 py-4 uppercase text-xs font-semibold">{rest.restaurantType}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${rest.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {rest.status}
                </span>
              </td>
              <td className="px-6 py-4 flex gap-2">
                <button
                  onClick={() => handleToggleStatus(rest)}
                  className="text-lg p-1.5 hover:bg-gray-100 rounded transition"
                  title="Toggle Active Status"
                >
                  {rest.status === "active" ? <MdToggleOn className="text-green-600 text-2xl" /> : <MdToggleOff className="text-gray-400 text-2xl" />}
                </button>
                <button
                  onClick={() => handleDelete(rest._id)}
                  className="text-red-500 hover:text-red-700 p-1.5 hover:bg-gray-100 rounded transition"
                  title="Delete Restaurant"
                >
                  <MdDeleteOutline className="text-xl" />
                </button>
              </td>
            </tr>
          ))}
        </DataTable>
      )}
    </div>
  );
};

export default AdminRestaurants;
