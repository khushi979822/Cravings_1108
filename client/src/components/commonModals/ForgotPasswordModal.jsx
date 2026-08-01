import { useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { LuLoaderCircle } from "react-icons/lu";
import api from "../../config/api.config";
import toast from "react-hot-toast";

const ForgotPasswordModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const handleCloseModal = () => {
    onClose();
    setFormData({
      email: "",
      otp: "",
      newPassword: "",
      confirmNewPassword: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleResetPassword = async () => {
    try {
      setIsLoading(true);
      if (!isOtpSent) {
        const res = await api.post("/auth/send-otp", formData);
        toast.success(res.data.message);
        setIsOtpSent(true);
      } else if (isOtpSent && !isOtpVerified) {
        const res = await api.post("/auth/verify-otp", formData);
        toast.success(res.data.message);
        setIsOtpVerified(true);
      } else if (isOtpSent && isOtpVerified) {
        if (formData.newPassword !== formData.confirmNewPassword) {
          toast.error("New password and confirm password do not match.");
          setIsLoading(false);
          return;
        }
        const res = await api.post("/auth/reset-password", formData);
        toast.success(res.data.message);
        handleCloseModal();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unknown error occurred during password reset. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl max-h-[85vh] overflow-y-auto relative p-6">
        <header className="flex justify-between items-center pb-3 border-b border-gray-200 mb-4">
          <div className="font-bold text-xl text-orange-700">
            Forgot Password
          </div>
          <button onClick={handleCloseModal} className="text-red-400 hover:text-red-600 transition-colors">
            <IoIosCloseCircleOutline className="text-2xl" />
          </button>
        </header>
        <main className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="font-semibold text-sm text-gray-700">
              Registered Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your registered email"
              className="border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
              disabled={isLoading || isOtpSent}
            />
          </div>

          {isOtpSent && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="otp" className="font-semibold text-sm text-gray-700">
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                placeholder="Enter 6-digit OTP"
                className="border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                disabled={isLoading || isOtpVerified}
              />
            </div>
          )}

          {isOtpSent && isOtpVerified && (
            <>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="newPassword" className="font-semibold text-sm text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                  disabled={isLoading}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="confirmNewPassword" className="font-semibold text-sm text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  value={formData.confirmNewPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className="border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                  disabled={isLoading}
                />
              </div>
            </>
          )}
        </main>
        <footer className="w-full pt-4 border-t border-gray-200 mt-6 flex justify-end gap-3">
          <button
            onClick={handleCloseModal}
            className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-orange-700 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            onClick={handleResetPassword}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LuLoaderCircle className="animate-spin" /> Please wait...
              </>
            ) : isOtpSent ? (
              isOtpVerified ? (
                "Reset Password"
              ) : (
                "Verify OTP"
              )
            ) : (
              "Send OTP"
            )}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
