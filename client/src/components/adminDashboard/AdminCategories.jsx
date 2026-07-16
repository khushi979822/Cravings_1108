import React, { useEffect, useState } from "react";
import api from "../../config/api.config";
import toast from "react-hot-toast";
import { LoadingSpinner, EmptyState, DataTable } from "../common/DashboardShared";
import { MdDeleteOutline, MdToggleOn, MdToggleOff } from "react-icons/md";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const fetchData = async () => {
    try {
      const res = await api.get("/admin/categories");
      setCategories(res.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (cat) => {
    const nextStatus = !cat.isActive;
    try {
      await api.patch(`/admin/categories/${cat._id}`, { isActive: nextStatus });
      toast.success("Category status updated successfully");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update category");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      toast.success("Category deleted successfully");
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
      await api.post("/admin/categories", formData);
      toast.success("Category created successfully");
      setShowForm(false);
      setFormData({ name: "", description: "" });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create category");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner message="Loading categories..." />;

  return (
    <div className="overflow-y-auto h-full p-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-(--color-base-content)">Food Categories</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-(--color-primary) text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition text-sm"
          >
            + Add Category
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-(--color-base-200) p-5 rounded-xl border border-(--color-base-300) mb-6 space-y-4 max-w-lg">
          <h3 className="font-bold text-lg">New Category</h3>
          <div>
            <label className="text-xs font-semibold block mb-1">Category Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-(--color-base-300) rounded bg-white"
            />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
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
              Create Category
            </button>
          </div>
        </form>
      )}

      {categories.length === 0 ? (
        <EmptyState message="No categories found." />
      ) : (
        <DataTable headers={["Category Name", "Description", "Status", "Actions"]}>
          {categories.map((cat) => (
            <tr key={cat._id} className="border-b border-(--color-base-300)">
              <td className="px-6 py-4 font-bold">{cat.name}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{cat.description || "N/A"}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${cat.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {cat.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-6 py-4 flex gap-2">
                <button
                  onClick={() => handleToggleStatus(cat)}
                  className="text-lg p-1.5 hover:bg-gray-100 rounded transition"
                  title="Toggle Active Status"
                >
                  {cat.isActive ? <MdToggleOn className="text-green-600 text-2xl" /> : <MdToggleOff className="text-gray-400 text-2xl" />}
                </button>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="text-red-500 hover:text-red-700 p-1.5 hover:bg-gray-100 rounded transition"
                  title="Delete Category"
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

export default AdminCategories;
