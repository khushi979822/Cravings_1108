import React, { useEffect, useState } from "react";
import api from "../../config/api.config";
import toast from "react-hot-toast";
import { LoadingSpinner, EmptyState, DataTable } from "../common/DashboardShared";
import { MdBlock, MdCheckCircle, MdAdd } from "react-icons/md";

const AdminRiders = () => {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "1998-01-01",
    gender: "male",
    password: "",
    vehicleDetails: {
      vehicleType: "Bike",
      vehicleNumber: "",
      vehicleModel: "",
      vehicleColor: "",
    },
    currentAddress: {
      address: "",
      city: "",
      state: "",
      pinCode: "",
      country: "India",
    },
    financialDetails: {
      bankName: "",
      accountNumber: "",
      ifscCode: "",
    }
  });

  const fetchData = async () => {
    try {
      const res = await api.get("/admin/riders");
      setRiders(res.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load riders");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (rider) => {
    const nextStatus = rider.profile.status === "active" ? "blocked" : "active";
    try {
      await api.patch(`/admin/riders/${rider._id}/status`, { status: nextStatus });
      toast.success("Rider status updated successfully");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update rider status");
    }
  };

  const handleInputChange = (e, section, field) => {
    const { name, value } = e.target;
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/riders", formData);
      toast.success("Rider profile created successfully");
      setShowForm(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create rider");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner message="Loading riders list..." />;

  return (
    <div className="overflow-y-auto h-full p-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-(--color-base-content)">Delivery Riders Management</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-(--color-primary) text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 flex items-center gap-1 transition text-sm"
          >
            <MdAdd /> Add Rider Account
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-(--color-base-200) p-5 rounded-xl border border-(--color-base-300) mb-6 space-y-4 max-w-2xl">
          <h3 className="font-bold text-lg">New Rider Account</h3>
          
          {/* Basic User credentials */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold block mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-(--color-base-300) rounded bg-white text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-(--color-base-300) rounded bg-white text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-(--color-base-300) rounded bg-white text-sm"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold block mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-(--color-base-300) rounded bg-white text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-(--color-base-300) rounded bg-white text-sm"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Vehicle info */}
          <div className="border-t border-(--color-base-300) pt-3">
            <h4 className="font-bold text-sm text-(--color-primary) mb-3">Vehicle Details</h4>
            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold block mb-1">Vehicle Model</label>
                <input
                  type="text"
                  value={formData.vehicleDetails.vehicleModel}
                  onChange={(e) => handleInputChange(e, "vehicleDetails", "vehicleModel")}
                  required
                  placeholder="e.g. Hero Splendor"
                  className="w-full px-3 py-2 border border-(--color-base-300) rounded bg-white text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Vehicle Number</label>
                <input
                  type="text"
                  value={formData.vehicleDetails.vehicleNumber}
                  onChange={(e) => handleInputChange(e, "vehicleDetails", "vehicleNumber")}
                  required
                  placeholder="e.g. MP-04-AB-1234"
                  className="w-full px-3 py-2 border border-(--color-base-300) rounded bg-white text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Vehicle Color</label>
                <input
                  type="text"
                  value={formData.vehicleDetails.vehicleColor}
                  onChange={(e) => handleInputChange(e, "vehicleDetails", "vehicleColor")}
                  required
                  placeholder="e.g. Black"
                  className="w-full px-3 py-2 border border-(--color-base-300) rounded bg-white text-sm"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="border-t border-(--color-base-300) pt-3">
            <h4 className="font-bold text-sm text-(--color-primary) mb-3">Current Address</h4>
            <input
              type="text"
              placeholder="Full Address"
              value={formData.currentAddress.address}
              onChange={(e) => handleInputChange(e, "currentAddress", "address")}
              required
              className="w-full px-3 py-2 border border-(--color-base-300) rounded bg-white text-sm mb-2"
            />
            <div className="grid grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="City"
                value={formData.currentAddress.city}
                onChange={(e) => handleInputChange(e, "currentAddress", "city")}
                required
                className="w-full px-3 py-2 border border-(--color-base-300) rounded bg-white text-sm"
              />
              <input
                type="text"
                placeholder="State"
                value={formData.currentAddress.state}
                onChange={(e) => handleInputChange(e, "currentAddress", "state")}
                required
                className="w-full px-3 py-2 border border-(--color-base-300) rounded bg-white text-sm"
              />
              <input
                type="text"
                placeholder="Pin Code"
                value={formData.currentAddress.pinCode}
                onChange={(e) => handleInputChange(e, "currentAddress", "pinCode")}
                required
                className="w-full px-3 py-2 border border-(--color-base-300) rounded bg-white text-sm"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-3">
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
              Save Account
            </button>
          </div>
        </form>
      )}

      {riders.length === 0 ? (
        <EmptyState message="No riders registered." />
      ) : (
        <DataTable headers={["Rider Name", "Vehicle Details", "Address", "Online Status", "Account Status", "Actions"]}>
          {riders.map((r) => (
            <tr key={r._id} className="border-b border-(--color-base-300)">
              <td className="px-6 py-4 font-bold">{r.fullName}</td>
              <td className="px-6 py-4 text-xs text-gray-700">
                {r.profile?.vehicleDetails?.vehicleModel || "N/A"} <br />
                <span className="font-mono text-gray-500 font-semibold">{r.profile?.vehicleDetails?.vehicleNumber || "N/A"}</span>
              </td>
              <td className="px-6 py-4 text-xs text-gray-500">{r.profile?.currentAddress?.address || "N/A"}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${r.profile?.isAvailable ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                  {r.profile?.isAvailable ? "Online" : "Offline"}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${r.profile?.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {r.profile?.status || "inactive"}
                </span>
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleToggleStatus(r)}
                  className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                    r.profile?.status === "active"
                      ? "bg-red-50 hover:bg-red-100 text-red-600"
                      : "bg-green-50 hover:bg-green-100 text-green-600"
                  }`}
                  title={r.profile?.status === "active" ? "Block Rider" : "Approve Rider"}
                >
                  {r.profile?.status === "active" ? (
                    <>
                      <MdBlock /> Block
                    </>
                  ) : (
                    <>
                      <MdCheckCircle /> Approve
                    </>
                  )}
                </button>
              </td>
            </tr>
          ))}
        </DataTable>
      )}
    </div>
  );
};

export default AdminRiders;
