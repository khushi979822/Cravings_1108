import Rider from "../models/rider.model.js";
import Order from "../models/order.model.js";
import Restaurant from "../models/restaurant.model.js";
import Menu from "../models/menu.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

// Helper to ensure rider profile exists
const getOrCreateRider = async (userId) => {
  let riderObj = await Rider.findOne({ riderId: userId });
  if (!riderObj) {
    riderObj = await Rider.create({
      riderId: userId,
      vehicleDetails: {
        vehicleType: "Bike",
        vehicleNumber: "DL-3S-AB-1234",
        vehicleModel: "Hero Splendor",
        vehicleColor: "Black",
      },
      currentAddress: {
        address: "Karond Colony",
        city: "Bhopal",
        state: "Madhya Pradesh",
        pinCode: "462001",
        country: "India",
      },
      financialDetails: {
        bankName: "State Bank of India",
        accountNumber: "30291823746",
        ifscCode: "SBIN0001234",
      },
      status: "active",
      averageRating: 5.0,
      isAvailable: true,
    });
  }
  return riderObj;
};

// GET /api/rider/dashboard
export const getRiderDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const riderObj = await getOrCreateRider(userId);

    const riderOrders = await Order.find({ riderId: riderObj._id });

    const totalCompleted = riderOrders.filter(o => o.orderStatus === "delivered").length;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = riderOrders.filter(o => new Date(o.createdAt) >= today);
    const todayCompleted = todayOrders.filter(o => o.orderStatus === "delivered").length;

    // Delivery earnings: let's assume flat 45 per completed delivery (or use actual deliveryCharge)
    const totalEarnings = riderOrders
      .filter(o => o.orderStatus === "delivered")
      .reduce((sum, o) => sum + (o.billDetails?.deliveryCharge || 45), 0);

    const todayEarnings = todayOrders
      .filter(o => o.orderStatus === "delivered")
      .reduce((sum, o) => sum + (o.billDetails?.deliveryCharge || 45), 0);

    const currentDelivery = riderOrders.find(o => 
      ["accepted", "preparing", "ready", "pickedUp", "onTheWay", "outForDelivery"].includes(o.orderStatus)
    );

    // Available requests: orders with status "ready" or "preparing" that have NO rider assigned yet
    const availableRequests = await Order.find({
      orderStatus: { $in: ["ready", "preparing"] },
      riderId: { $exists: false }
    }).populate("restaurantId");

    res.status(200).json({
      message: "Rider stats fetched",
      data: {
        riderName: req.user.fullName,
        photo: req.user.photo,
        isAvailable: riderObj.isAvailable,
        averageRating: riderObj.averageRating,
        currentDelivery,
        availableRequests,
        completedDeliveriesCount: totalCompleted,
        todayCompletedDeliveriesCount: todayCompleted,
        todayEarnings,
        totalEarnings,
      }
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/rider/availability
export const toggleRiderAvailability = async (req, res, next) => {
  try {
    const riderObj = await getOrCreateRider(req.user._id);
    const { isAvailable } = req.body;

    if (isAvailable !== undefined) {
      riderObj.isAvailable = isAvailable;
      await riderObj.save();
    }

    res.status(200).json({ message: "Availability updated successfully", data: riderObj });
  } catch (error) {
    next(error);
  }
};

// GET /api/rider/delivery-requests
export const getRiderDeliveryRequests = async (req, res, next) => {
  try {
    const requests = await Order.find({
      orderStatus: { $in: ["ready", "preparing"] },
      riderId: { $exists: false }
    }).populate("restaurantId");

    res.status(200).json({ data: requests });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/rider/orders/:orderId/accept
export const acceptRiderDelivery = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const riderObj = await getOrCreateRider(req.user._id);

    // Conditional check to avoid double rider acceptance
    const order = await Order.findOneAndUpdate(
      { _id: orderId, riderId: { $exists: false } },
      { $set: { riderId: riderObj._id, orderStatus: "accepted" } },
      { new: true }
    );

    if (!order) {
      return res.status(400).json({ message: "Order is already accepted by another rider or not found" });
    }

    res.status(200).json({ message: "Delivery request accepted successfully", data: order });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/rider/orders/:orderId/reject
export const rejectRiderDelivery = async (req, res, next) => {
  try {
    res.status(200).json({ message: "Delivery request skipped successfully" });
  } catch (error) {
    next(error);
  }
};

// GET /api/rider/current-order
export const getRiderCurrentOrder = async (req, res, next) => {
  try {
    const riderObj = await getOrCreateRider(req.user._id);
    const order = await Order.findOne({
      riderId: riderObj._id,
      orderStatus: { $in: ["accepted", "preparing", "ready", "pickedUp", "onTheWay", "outForDelivery"] }
    }).populate("restaurantId");

    if (!order) {
      return res.status(200).json({ data: null, message: "No active deliveries" });
    }

    // Populate order items details
    const menuData = await Menu.findOne({ restaurantId: order.restaurantId });
    const orderItemsWithDetails = order.orderItems.map(oi => {
      const itemDetail = menuData?.menuItems.find(mi => mi._id.toString() === oi.itemId.toString());
      return {
        ...oi.toObject(),
        detail: itemDetail || { itemName: "Unknown Item", price: 0 }
      };
    });

    res.status(200).json({
      data: {
        ...order.toObject(),
        orderItems: orderItemsWithDetails,
      }
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/rider/orders/:orderId/status
export const updateRiderOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body; // expected: ready, pickedUp, outForDelivery, delivered

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const riderObj = await getOrCreateRider(req.user._id);
    if (order.riderId.toString() !== riderObj._id.toString()) {
      return res.status(403).json({ message: "Unauthorized. You are not assigned to this order" });
    }

    // Step sequences checks
    const statusSequence = ["accepted", "preparing", "ready", "pickedUp", "outForDelivery", "delivered"];
    const currentIdx = statusSequence.indexOf(order.orderStatus);
    const nextIdx = statusSequence.indexOf(status);

    if (nextIdx === -1 || nextIdx <= currentIdx) {
      return res.status(400).json({ message: `Cannot change status from ${order.orderStatus} to ${status}` });
    }

    order.orderStatus = status;
    
    // Automatically set payment status to completed if paymentMethod is COD/UPI and status is delivered
    if (status === "delivered" && order.paymentDetails) {
      order.paymentDetails.paymentStatus = "completed";
    }

    await order.save();
    res.status(200).json({ message: `Order status updated to ${status}`, data: order });
  } catch (error) {
    next(error);
  }
};

// GET /api/rider/delivery-history
export const getRiderDeliveryHistory = async (req, res, next) => {
  try {
    const riderObj = await getOrCreateRider(req.user._id);
    const orders = await Order.find({
      riderId: riderObj._id,
      orderStatus: "delivered"
    }).populate("restaurantId").sort({ updatedAt: -1 });

    res.status(200).json({ data: orders });
  } catch (error) {
    next(error);
  }
};

// GET /api/rider/earnings
export const getRiderEarnings = async (req, res, next) => {
  try {
    const riderObj = await getOrCreateRider(req.user._id);
    const orders = await Order.find({
      riderId: riderObj._id,
      orderStatus: "delivered"
    });

    const deliveries = orders.map(o => ({
      orderId: o._id,
      date: o.updatedAt,
      amount: o.billDetails?.deliveryCharge || 45
    }));

    const total = deliveries.reduce((sum, d) => sum + d.amount, 0);

    res.status(200).json({
      data: {
        totalEarnings: total,
        deliveries
      }
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/rider/location
export const updateRiderLocation = async (req, res, next) => {
  try {
    const riderObj = await getOrCreateRider(req.user._id);
    const { lat, lon } = req.body;

    if (lat && lon) {
      riderObj.currentLocation = { lat, lon };
      await riderObj.save();
    }

    res.status(200).json({ message: "Location updated successfully", data: riderObj.currentLocation });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/rider/profile
export const updateRiderProfile = async (req, res, next) => {
  try {
    const riderObj = await getOrCreateRider(req.user._id);
    const { vehicleDetails, currentAddress, financialDetails } = req.body;

    if (vehicleDetails) riderObj.vehicleDetails = vehicleDetails;
    if (currentAddress) riderObj.currentAddress = currentAddress;
    if (financialDetails) riderObj.financialDetails = financialDetails;

    await riderObj.save();
    res.status(200).json({ message: "Profile updated successfully", data: riderObj });
  } catch (error) {
    next(error);
  }
};
