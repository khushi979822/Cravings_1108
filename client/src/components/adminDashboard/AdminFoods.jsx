import React, { useEffect, useState } from "react";
import api from "../../config/api.config";
import toast from "react-hot-toast";
import { LoadingSpinner, EmptyState, DataTable } from "../common/DashboardShared";
import { MdDeleteOutline, MdToggleOn, MdToggleOff } from "react-icons/md";

const AdminFoods = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [formData, setFormData] = useState({
    restaurantId: "",
    itemName: "",
    description: "",
    price: "",
    category: "",
  });

  const fetchData = async () => {
    try {
      const res = await api.get("/admin/foods");
      setFoods(res.data.data || []);
      
      const restRes = await api.get("/admin/restaurants");
      setRestaurants(restRes.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load food items");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (item) => {
    const nextAvailability = !item.isAvailable;
    try {
      await api.patch(`/admin/foods/${item._id}`, { isAvailable: nextAvailability });
      toast.success("Food availability updated");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update availability");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this food item?")) return;
    try {
      await api.delete(`/admin/foods/${id}`);
      toast.success("Food item deleted successfully");
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
      await api.post("/admin/foods", formData);
      toast.success("Food item added successfully");
      setShowForm(false);
      setFormData({
        restaurantId: "",
        itemName: "",
        description: "",
        price: "",
        category: "",
      });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create food item");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner message="Loading food items..." />;

  return (
    <div className="overflow-y-auto h-full p-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-(--color-base-content)">Food Items Menu</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-(--color-primary) text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition text-sm"
          >
            + Add Food Item
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-(--color-base-200) p-5 rounded-xl border border-(--color-base-300) mb-6 space-y-4 max-w-2xl">
          <h3 className="font-bold text-lg">New Food Menu Item</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold block mb-1">Select Restaurant</label>
              <select
                name="restaurantId"
                value={formData.restaurantId}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-(--color-base-300) rounded bg-white"
              >
                <option value="">Select Restaurant...</option>
                {restaurants.map(r => (
                  <option key={r._id} value={r._id}>{r.restaurantName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1">Item Name</label>
              <input
                type="text"
                name="itemName"
                value={formData.itemName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-(--color-base-300) rounded bg-white"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold block mb-1">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-(--color-base-300) rounded bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1">Category</label>
              <input
                type="text"
                name="category"
                placeholder="e.g. Starters, Main Course, Drinks"
                value={formData.category}
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
              Save Item
            </button>
          </div>
        </form>
      )}

      {foods.length === 0 ? (
        <EmptyState message="No food items found." />
      ) : (
        <DataTable headers={["Food Item", "Restaurant", "Category", "Price", "Available", "Actions"]}>
          {foods.map((food) => (
            <tr key={food._id} className="border-b border-(--color-base-300)">
              <td className="px-6 py-4 font-bold">{food.itemName}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{food.restaurantName}</td>
              <td className="px-6 py-4 text-xs font-semibold">{food.category}</td>
              <td className="px-6 py-4 font-bold text-(--color-primary)">₹{food.price}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${food.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {food.isAvailable ? "Yes" : "No"}
                </span>
              </td>
              <td className="px-6 py-4 flex gap-2">
                <button
                  onClick={() => handleToggleAvailability(food)}
                  className="text-lg p-1.5 hover:bg-gray-100 rounded transition"
                  title="Toggle Availability"
                >
                  {food.isAvailable ? <MdToggleOn className="text-green-600 text-2xl" /> : <MdToggleOff className="text-gray-400 text-2xl" />}
                </button>
                <button
                  onClick={() => handleDelete(food._id)}
                  className="text-red-500 hover:text-red-700 p-1.5 hover:bg-gray-100 rounded transition"
                  title="Delete Dish"
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

export default AdminFoods;
