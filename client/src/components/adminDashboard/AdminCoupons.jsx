import React, { useEffect, useState } from "react";
import api from "../../config/api.config";
import toast from "react-hot-toast";
import { LoadingSpinner, EmptyState, DataTable } from "../common/DashboardShared";
import { MdDeleteOutline, MdToggleOn, MdToggleOff } from "react-icons/md";

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "",
    expiryDate: "",
  });

  const fetchData = async () => {
    try {
      const res = await api.get("/admin/coupons");
      setCoupons(res.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (coupon) => {
    const nextStatus = !coupon.isActive;
    try {
      await api.patch(`/admin/coupons/${coupon._id}`, { isActive: nextStatus });
      toast.success("Coupon status updated");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await api.delete(`/admin/coupons/${id}`);
      toast.success("Coupon deleted successfully");
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
      await api.post("/admin/coupons", formData);
      toast.success("Coupon created successfully");
      setShowForm(false);
      setFormData({
        code: "",
        discountType: "percentage",
        discountValue: "",
        minOrderAmount: "",
        expiryDate: "",
      });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create coupon");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner message="Loading coupons..." />;

  return (
    <div className="overflow-y-auto h-full p-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-(--color-base-content)">Discount Coupons</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-(--color-primary) text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition text-sm"
          >
            + Add Coupon
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-(--color-base-200) p-5 rounded-xl border border-(--color-base-300) mb-6 space-y-4 max-w-lg">
          <h3 className="font-bold text-lg">Create Coupon</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold block mb-1">Coupon Code (Uppercase)</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                required
                placeholder="e.g. CRAVING50"
                className="w-full px-3 py-2 border border-(--color-base-300) rounded bg-white text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1">Discount Type</label>
              <select
                name="discountType"
                value={formData.discountType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-(--color-base-300) rounded bg-white text-sm"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount (₹)</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold block mb-1">Discount Value</label>
              <input
                type="number"
                name="discountValue"
                value={formData.discountValue}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-(--color-base-300) rounded bg-white text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1">Min Order Amount (₹)</label>
              <input
                type="number"
                name="minOrderAmount"
                value={formData.minOrderAmount}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-(--color-base-300) rounded bg-white text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1">Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-(--color-base-300) rounded bg-white text-sm"
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
              Create Coupon
            </button>
          </div>
        </form>
      )}

      {coupons.length === 0 ? (
        <EmptyState message="No coupons found." />
      ) : (
        <DataTable headers={["Code", "Discount", "Min Order Value", "Expiry Date", "Status", "Actions"]}>
          {coupons.map((coupon) => (
            <tr key={coupon._id} className="border-b border-(--color-base-300)">
              <td className="px-6 py-4 font-extrabold text-orange-700">{coupon.code}</td>
              <td className="px-6 py-4 font-bold text-sm">
                {coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
              </td>
              <td className="px-6 py-4 text-xs font-semibold">₹{coupon.minOrderAmount}</td>
              <td className="px-6 py-4 text-xs text-gray-500">{new Date(coupon.expiryDate).toLocaleDateString()}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${coupon.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {coupon.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-6 py-4 flex gap-2">
                <button
                  onClick={() => handleToggleStatus(coupon)}
                  className="text-lg p-1.5 hover:bg-gray-100 rounded transition"
                  title="Toggle Coupon Active Status"
                >
                  {coupon.isActive ? <MdToggleOn className="text-green-600 text-2xl" /> : <MdToggleOff className="text-gray-400 text-2xl" />}
                </button>
                <button
                  onClick={() => handleDelete(coupon._id)}
                  className="text-red-500 hover:text-red-700 p-1.5 hover:bg-gray-100 rounded transition"
                  title="Delete Coupon"
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

export default AdminCoupons;
