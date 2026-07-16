import React, { useEffect, useState } from "react";
import api from "../../config/api.config";
import toast from "react-hot-toast";
import { LoadingSpinner, EmptyState } from "../common/DashboardShared";
import { MdOutlineLocationOn, MdDeleteOutline, MdEdit } from "react-icons/md";

const AddressBook = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    country: "India",
    addressType: "home",
    isDefault: false,
  });

  const fetchAddresses = async () => {
    try {
      const res = await api.get("/customer/addresses");
      setAddresses(res.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        const res = await api.patch(`/customer/addresses/${editingAddress._id}`, formData);
        toast.success("Address updated successfully");
        setAddresses(res.data.data);
      } else {
        const res = await api.post("/customer/addresses", formData);
        toast.success("Address added successfully");
        setAddresses(res.data.data);
      }
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save address");
    }
  };

  const deleteAddress = async (id) => {
    try {
      const res = await api.delete(`/customer/addresses/${id}`);
      toast.success("Address deleted successfully");
      setAddresses(res.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete address");
    }
  };

  const editAddress = (addr) => {
    setEditingAddress(addr);
    setFormData({
      name: addr.name,
      address: addr.address,
      city: addr.city,
      state: addr.state,
      pinCode: addr.pinCode,
      country: addr.country,
      addressType: addr.addressType,
      isDefault: addr.isDefault,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      city: "",
      state: "",
      pinCode: "",
      country: "India",
      addressType: "home",
      isDefault: false,
    });
    setEditingAddress(null);
    setShowForm(false);
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  if (loading) return <LoadingSpinner message="Loading saved addresses..." />;

  return (
    <div className="overflow-y-auto h-full p-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-(--color-base-content)">Saved Addresses</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-(--color-primary) text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition text-sm"
          >
            + Add New Address
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-(--color-base-200) p-5 rounded-xl border border-(--color-base-300) mb-6 space-y-4 max-w-2xl">
          <h3 className="font-bold text-lg">{editingAddress ? "Edit Address" : "New Address"}</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold block mb-1">Contact Person Name</label>
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
              <label className="text-xs font-semibold block mb-1">Address Type</label>
              <select
                name="addressType"
                value={formData.addressType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-(--color-base-300) rounded bg-white"
              >
                <option value="home">Home</option>
                <option value="work">Work</option>
                <option value="other">Other</option>
              </select>
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

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isDefault"
              id="isDefault"
              checked={formData.isDefault}
              onChange={handleInputChange}
              className="w-4 h-4 accent-(--color-primary)"
            />
            <label htmlFor="isDefault" className="text-xs font-semibold cursor-pointer">Set as default address</label>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border border-(--color-base-300) rounded-lg text-sm bg-white font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-(--color-primary) text-white rounded-lg text-sm font-semibold hover:opacity-90"
            >
              Save Address
            </button>
          </div>
        </form>
      )}

      {addresses.length === 0 ? (
        <EmptyState message="No addresses saved yet." />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div key={addr._id} className="bg-(--color-base-100) p-4 rounded-xl border border-(--color-base-300) flex justify-between items-start">
              <div className="flex gap-3">
                <div className="text-2xl text-(--color-primary) bg-(--color-primary)/10 p-2 rounded-lg h-fit">
                  <MdOutlineLocationOn />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-base">{addr.name}</h4>
                    <span className="bg-orange-100 text-orange-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                      {addr.addressType}
                    </span>
                    {addr.isDefault && (
                      <span className="bg-green-100 text-green-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mt-2">{addr.address}</p>
                  <p className="text-xs text-gray-500 mt-1">{addr.city}, {addr.state} - {addr.pinCode}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => editAddress(addr)}
                  className="text-gray-500 hover:text-(--color-primary) p-2 hover:bg-white rounded transition"
                  title="Edit Address"
                >
                  <MdEdit className="text-lg" />
                </button>
                <button
                  onClick={() => deleteAddress(addr._id)}
                  className="text-red-500 hover:text-red-700 p-2 hover:bg-white rounded transition"
                  title="Delete Address"
                >
                  <MdDeleteOutline className="text-lg" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressBook;
