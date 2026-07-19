import React, { useState, useEffect } from "react";
import { MdEdit, MdOutlineLockReset, MdOutlineAddAPhoto } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import api from "../../config/api.config";
import toast from "react-hot-toast";
import PasswordChangeModal from "../commonModals/PasswordChangeModal";
import { LoadingSpinner } from "../common/DashboardShared";

const RiderSetting = () => {
  const { user, setUser } = useAuth();
  const [editingProfile, setEditingProfile] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] =
    useState(false);

  // Rider extra details profile state
  const [loadingRider, setLoadingRider] = useState(true);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    vehicleType: "",
    vehicleNumber: "",
    vehicleModel: "",
    vehicleColor: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    bankName: "",
    accountNumber: "",
    ifscCode: ""
  });

  const fetchRiderProfile = async () => {
    try {
      const res = await api.get("/rider/dashboard");
      const riderData = res.data.data;

      setFormData(prev => ({
        ...prev,
        vehicleType: riderData.vehicleDetails?.vehicleType || "Bike",
        vehicleNumber: riderData.vehicleDetails?.vehicleNumber || "",
        vehicleModel: riderData.vehicleDetails?.vehicleModel || "",
        vehicleColor: riderData.vehicleDetails?.vehicleColor || "",
        address: riderData.currentAddress?.address || "",
        city: riderData.currentAddress?.city || "",
        state: riderData.currentAddress?.state || "",
        pinCode: riderData.currentAddress?.pinCode || "",
        bankName: riderData.financialDetails?.bankName || "",
        accountNumber: riderData.financialDetails?.accountNumber || "",
        ifscCode: riderData.financialDetails?.ifscCode || ""
      }));
    } catch (error) {
      console.log("Error loading rider profile details", error);
    } finally {
      setLoadingRider(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);

      // Save user base details
      const payload = new FormData();
      payload.append("fullName", formData.fullName);
      payload.append("email", formData.email.toLowerCase());
      payload.append("phone", formData.phone);
      if (profilePic) {
        payload.append("displayPic", profilePic);
      }

      const response = await api.put(`/common/edit-profile`, payload);
      setUser(response.data.data);
      sessionStorage.setItem("cravingUser", JSON.stringify(response.data.data));

      // Save rider vehicle & other details
      await api.patch("/rider/profile", {
        vehicleDetails: {
          vehicleType: formData.vehicleType,
          vehicleNumber: formData.vehicleNumber,
          vehicleModel: formData.vehicleModel,
          vehicleColor: formData.vehicleColor
        },
        currentAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pinCode: formData.pinCode,
          country: "India"
        },
        financialDetails: {
          bankName: formData.bankName,
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifscCode
        }
      });

      setEditingProfile(false);
      toast.success("Profile & vehicle details updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setProfilePicPreview(URL.createObjectURL(file));
    setProfilePic(file);
  };

  useEffect(() => {
    fetchRiderProfile();
  }, []);

  if (loadingRider) return <LoadingSpinner message="Loading profile..." />;

  return (
    <>
      <div className="overflow-y-auto h-full p-4 space-y-6">
        <div className="bg-(--color-base-200) rounded-xl p-6 border border-(--color-base-300)">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-(--color-base-content)">Profile Information</h3>
            {!editingProfile ? (
              <div className="flex gap-3">
                <button
                  onClick={() => setEditingProfile(true)}
                  className="flex items-center gap-2 bg-(--color-primary) text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90"
                >
                  <MdEdit /> Edit Profile
                </button>
                <button
                  onClick={() => setIsPasswordChangeModalOpen(true)}
                  className="flex items-center gap-2 border border-(--color-primary) text-(--color-primary) px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-(--color-primary) hover:text-white"
                >
                  <MdOutlineLockReset /> Change Password
                </button>
              </div>
            ) : (
              <div className="flex gap-2 justify-end">
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center gap-2 bg-(--color-primary) text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => setEditingProfile(false)}
                  className="flex items-center gap-2 bg-gray-100 text-gray-800 px-3 py-1.5 rounded-lg text-xs font-semibold"
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24">
                  <img
                    src={profilePicPreview || user?.photo?.url || "https://placehold.co/600x400?text=Rider"}
                    alt="Profile"
                    className="w-full h-full rounded-xl object-cover border border-(--color-primary)"
                  />
                </div>
                {editingProfile && (
                  <div className="absolute cursor-pointer bottom-0 right-0 p-1.5 rounded-br-xl bg-white border border-gray-300">
                    <label htmlFor="profilePic" className="cursor-pointer">
                      <MdOutlineAddAPhoto className="text-xs" />
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      name="profilePic"
                      id="profilePic"
                      className="hidden"
                      onChange={handleProfilePicChange}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                <div>
                  <label className="text-xs font-semibold block mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleProfileChange}
                    disabled={!editingProfile}
                    className="w-full px-3 py-2 border border-(--color-base-300) rounded bg-white text-xs disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full px-3 py-2 border border-(--color-base-300) rounded bg-white text-xs opacity-60 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleProfileChange}
                    disabled={!editingProfile}
                    className="w-full px-3 py-2 border border-(--color-base-300) rounded bg-white text-xs disabled:opacity-60"
                  />
                </div>
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="border-t border-(--color-base-300) pt-4">
              <h4 className="font-bold text-sm text-(--color-primary) mb-3">Vehicle details</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-semibold block mb-1">Vehicle Type</label>
                  <input
                    type="text"
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleProfileChange}
                    disabled={!editingProfile}
                    className="w-full px-3 py-2 border border-(--color-base-300) rounded bg-white text-xs disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Model Name</label>
                  <input
                    type="text"
                    name="vehicleModel"
                    value={formData.vehicleModel}
                    onChange={handleProfileChange}
                    disabled={!editingProfile}
                    className="w-full px-3 py-2 border border-(--color-base-300) rounded bg-white text-xs disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Registration Number</label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleProfileChange}
                    disabled={!editingProfile}
                    className="w-full px-3 py-2 border border-(--color-base-300) rounded bg-white text-xs disabled:opacity-60 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Vehicle Color</label>
                  <input
                    type="text"
                    name="vehicleColor"
                    value={formData.vehicleColor}
                    onChange={handleProfileChange}
                    disabled={!editingProfile}
                    className="w-full px-3 py-2 border border-(--color-base-300) rounded bg-white text-xs disabled:opacity-60"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="border-t border-(--color-base-300) pt-4">
              <h4 className="font-bold text-sm text-(--color-primary) mb-3">Address details</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold block mb-1">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleProfileChange}
                    disabled={!editingProfile}
                    className="w-full px-3 py-2 border border-(--color-base-300) rounded bg-white text-xs disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleProfileChange}
                    disabled={!editingProfile}
                    className="w-full px-3 py-2 border border-(--color-base-300) rounded bg-white text-xs disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Pin Code</label>
                  <input
                    type="text"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleProfileChange}
                    disabled={!editingProfile}
                    className="w-full px-3 py-2 border border-(--color-base-300) rounded bg-white text-xs disabled:opacity-60"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isPasswordChangeModalOpen && (
        <PasswordChangeModal
          open={isPasswordChangeModalOpen}
          onClose={() => setIsPasswordChangeModalOpen(false)}
        />
      )}
    </>
  );
};

export default RiderSetting;
