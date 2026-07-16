import React, { useEffect, useState } from "react";
import api from "../../config/api.config";
import toast from "react-hot-toast";
import { LoadingSpinner, EmptyState, StatusBadge } from "../common/DashboardShared";
import { MdOutlineClose, MdOutlineStarBorder, MdOutlineStar } from "react-icons/md";

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modals state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [ratingOrder, setRatingOrder] = useState(null);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);

  // Rating forms state
  const [restaurantRating, setRestaurantRating] = useState(5);
  const [restaurantReview, setRestaurantReview] = useState("");
  const [riderRating, setRiderRating] = useState(5);
  const [riderReview, setRiderReview] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await api.get(`/customer/orders?status=${statusFilter}&search=${searchQuery}`);
      setOrders(res.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await api.patch(`/customer/orders/${orderId}/cancel`);
      toast.success("Order cancelled successfully");
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel order");
    }
  };

  const handleReorder = async (orderId) => {
    try {
      const res = await api.post(`/customer/orders/${orderId}/reorder`);
      toast.success(res.data.message || "Items added to new order!");
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reorder");
    }
  };

  const openDetails = async (orderId) => {
    try {
      const res = await api.get(`/customer/orders/${orderId}`);
      setSelectedOrder(res.data.data);
      setDetailModalOpen(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load order details");
    }
  };

  const openRating = (order) => {
    setRatingOrder(order);
    setRestaurantRating(5);
    setRestaurantReview("");
    setRiderRating(5);
    setRiderReview("");
    setRatingModalOpen(true);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await api.post(`/customer/orders/${ratingOrder._id}/review`, {
        restaurantRating,
        restaurantReview,
        riderRating,
        riderReview,
      });
      toast.success("Thank you for your feedback!");
      setRatingModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, searchQuery]);

  return (
    <div className="overflow-y-auto h-full p-2">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-(--color-base-content)">My Orders</h2>
        
        {/* Filters and search bar */}
        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by Order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-(--color-base-300) rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 flex-1"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-(--color-base-300) rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="pickedUp">Picked Up</option>
            <option value="outForDelivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching your orders..." />
      ) : orders.length === 0 ? (
        <EmptyState message="No orders matched your filters." />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-(--color-base-100) p-5 rounded-xl border border-(--color-base-300) flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex justify-between items-center pb-2 border-b border-(--color-base-300) mb-3">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 block uppercase">Order ID</span>
                    <span className="font-mono text-xs font-semibold text-gray-700">{order._id}</span>
                  </div>
                  <StatusBadge status={order.orderStatus} />
                </div>
                <h3 className="font-bold text-base text-gray-900">{order.restaurantId?.restaurantName || "Restaurant"}</h3>
                <p className="text-xs text-gray-500 mt-1">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                <div className="flex gap-2 items-center mt-3">
                  <span className="text-sm font-semibold text-gray-600">Total Price:</span>
                  <span className="font-bold text-lg text-(--color-primary)">₹{order.billDetails?.finalAmount}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 mt-4 pt-3 border-t border-(--color-base-300) flex-wrap">
                <button
                  onClick={() => openDetails(order._id)}
                  className="flex-1 bg-white hover:bg-gray-50 border border-(--color-base-300) text-gray-700 text-xs font-bold py-2 rounded-lg transition"
                >
                  View Details
                </button>
                {order.orderStatus === "pending" && (
                  <button
                    onClick={() => handleCancelOrder(order._id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 rounded-lg transition"
                  >
                    Cancel Order
                  </button>
                )}
                {["delivered", "cancelled"].includes(order.orderStatus) && (
                  <button
                    onClick={() => handleReorder(order._id)}
                    className="flex-1 bg-orange-700 hover:bg-orange-600 text-white text-xs font-bold py-2 rounded-lg transition"
                  >
                    Reorder
                  </button>
                )}
                {order.orderStatus === "delivered" && (
                  <button
                    onClick={() => openRating(order)}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-bold py-2 rounded-lg transition"
                  >
                    Rate & Review
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {detailModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <header className="flex justify-between items-center p-5 border-b border-(--color-base-300)">
              <div>
                <h3 className="font-bold text-lg">Order Details</h3>
                <span className="font-mono text-xs text-gray-500">ID: {selectedOrder._id}</span>
              </div>
              <button onClick={() => setDetailModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <MdOutlineClose className="text-2xl" />
              </button>
            </header>

            <main className="p-5 space-y-6">
              {/* Restaurant and status */}
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h4 className="font-bold text-lg">{selectedOrder.restaurantId?.restaurantName}</h4>
                  <p className="text-xs text-gray-500 mt-1">{selectedOrder.restaurantId?.address}</p>
                </div>
                <StatusBadge status={selectedOrder.orderStatus} />
              </div>

              {/* Items List */}
              <div className="bg-(--color-base-200) p-4 rounded-xl space-y-3">
                <h5 className="font-bold text-sm text-(--color-base-content) border-b border-(--color-base-300) pb-2">Ordered Items</h5>
                {selectedOrder.orderItems?.map((oi, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="font-semibold text-gray-700">{oi.detail?.itemName} <span className="text-xs text-gray-400">x{oi.quantity}</span></span>
                    <span className="font-bold text-gray-800">₹{(oi.detail?.price || 0) * oi.quantity}</span>
                  </div>
                ))}
                
                {/* Total break down */}
                <div className="border-t border-(--color-base-300) pt-3 space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Tax Amount:</span>
                    <span>₹{selectedOrder.billDetails?.taxAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charge:</span>
                    <span>₹{selectedOrder.billDetails?.deliveryCharge}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span className="text-green-600">-₹{selectedOrder.billDetails?.discountAmount || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-gray-900 border-t border-(--color-base-300) pt-2">
                    <span>Final Amount Paid:</span>
                    <span>₹{selectedOrder.billDetails?.finalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Delivery & Payment details */}
              <div className="grid md:grid-cols-2 gap-4 text-xs">
                <div className="border border-(--color-base-300) p-3 rounded-xl">
                  <h5 className="font-bold text-gray-800 uppercase mb-2">Delivery Address</h5>
                  <p className="font-semibold">{selectedOrder.deliveryAddress?.name}</p>
                  <p className="text-gray-600 mt-1">{selectedOrder.deliveryAddress?.address}, {selectedOrder.deliveryAddress?.city}</p>
                  <p className="text-gray-500 mt-0.5">{selectedOrder.deliveryAddress?.state} - {selectedOrder.deliveryAddress?.pinCode}</p>
                </div>
                <div className="border border-(--color-base-300) p-3 rounded-xl space-y-2">
                  <h5 className="font-bold text-gray-800 uppercase mb-2">Payment Details</h5>
                  <div className="flex justify-between">
                    <span>Method:</span>
                    <span className="font-semibold uppercase">{selectedOrder.paymentDetails?.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <StatusBadge status={selectedOrder.paymentDetails?.paymentStatus} />
                  </div>
                </div>
              </div>

              {/* Assigned Rider details */}
              {selectedOrder.riderDetails && (
                <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 flex items-center gap-4">
                  <img
                    src={selectedOrder.riderDetails.photo?.url || "https://placehold.co/600x400?text=Rider"}
                    alt={selectedOrder.riderDetails.fullName}
                    className="w-12 h-12 rounded-full object-cover border border-orange-200"
                  />
                  <div>
                    <h5 className="font-bold text-sm text-gray-900">Your Rider: {selectedOrder.riderDetails.fullName}</h5>
                    <p className="text-xs text-gray-600 mt-1">Vehicle: {selectedOrder.riderDetails.vehicleDetails?.vehicleModel} ({selectedOrder.riderDetails.vehicleDetails?.vehicleNumber})</p>
                    <p className="text-xs text-orange-700 font-semibold mt-1">📞 Contact: {selectedOrder.riderDetails.phone}</p>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      )}

      {/* Review & Rating Modal */}
      {ratingModalOpen && ratingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <form onSubmit={submitReview} className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
            <button
              type="button"
              onClick={() => setRatingModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-700"
            >
              <MdOutlineClose className="text-2xl" />
            </button>
            <h3 className="font-bold text-lg mb-4 text-(--color-base-content)">Rate Your Experience</h3>

            <div className="space-y-4">
              {/* Restaurant Rating */}
              <div className="space-y-2">
                <label className="text-sm font-semibold block text-gray-700">Rate the Restaurant ({ratingOrder.restaurantId?.restaurantName})</label>
                <div className="flex gap-1 text-2xl text-yellow-500">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRestaurantRating(star)}
                    >
                      {star <= restaurantRating ? <MdOutlineStar /> : <MdOutlineStarBorder />}
                    </button>
                  ))}
                </div>
                <textarea
                  placeholder="Tell us about the food quality, taste, packaging..."
                  value={restaurantReview}
                  onChange={(e) => setRestaurantReview(e.target.value)}
                  rows="2"
                  className="w-full border border-(--color-base-300) rounded-lg p-2 text-xs resize-none"
                />
              </div>

              {/* Rider Rating */}
              {ratingOrder.riderId && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold block text-gray-700">Rate the Rider</label>
                  <div className="flex gap-1 text-2xl text-yellow-500">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRiderRating(star)}
                      >
                        {star <= riderRating ? <MdOutlineStar /> : <MdOutlineStarBorder />}
                      </button>
                    ))}
                  </div>
                  <textarea
                    placeholder="Tell us about delivery speed, rider behavior..."
                    value={riderReview}
                    onChange={(e) => setRiderReview(e.target.value)}
                    rows="2"
                    className="w-full border border-(--color-base-300) rounded-lg p-2 text-xs resize-none"
                  />
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setRatingModalOpen(false)}
                className="px-4 py-2 border border-(--color-base-300) rounded-lg text-sm bg-white font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingReview}
                className="px-4 py-2 bg-orange-700 hover:bg-orange-600 text-white rounded-lg text-sm font-semibold transition"
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CustomerOrders;
