import Customer from "../models/customer.model.js";
import Order from "../models/order.model.js";
import Restaurant from "../models/restaurant.model.js";
import Menu from "../models/menu.model.js";
import Coupon from "../models/coupon.model.js";
import Review from "../models/review.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

// Helper to ensure customer record exists
const getOrCreateCustomer = async (userId) => {
  let customerObj = await Customer.findOne({ customerId: userId });
  if (!customerObj) {
    customerObj = await Customer.create({
      customerId: userId,
      addressBook: [],
      favourites: [],
    });
  }
  return customerObj;
};

// GET /api/customer/dashboard
export const getCustomerDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const customerObj = await getOrCreateCustomer(userId);

    const orders = await Order.find({ customerId: customerObj._id });

    // Calculate stats
    const totalOrders = orders.length;
    const activeOrder = orders.find(o => 
      !["delivered", "cancelled", "failed", "rejected"].includes(o.orderStatus)
    );
    const deliveredOrders = orders.filter(o => o.orderStatus === "delivered").length;
    const cancelledOrders = orders.filter(o => o.orderStatus === "cancelled").length;
    const totalAmountSpent = orders
      .filter(o => o.paymentDetails?.paymentStatus === "completed")
      .reduce((sum, o) => sum + (o.billDetails?.finalAmount || 0), 0);

    const savedAddresses = customerObj.addressBook || [];
    const recentOrders = await Order.find({ customerId: customerObj._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("restaurantId");

    // Get all menu items across all restaurants to recommend / find favorites
    const allMenus = await Menu.find({});
    const itemsMap = {};
    const recommendedFoodItems = [];
    
    allMenus.forEach(menu => {
      menu.menuItems.forEach(item => {
        itemsMap[item._id.toString()] = { ...item.toObject(), restaurantId: menu.restaurantId };
        if (item.isRecommended || item.isTopRated) {
          recommendedFoodItems.push({ ...item.toObject(), restaurantId: menu.restaurantId });
        }
      });
    });

    const favouriteFoodItems = (customerObj.favourites || [])
      .map(id => itemsMap[id.toString()])
      .filter(Boolean);

    const availableCoupons = await Coupon.find({ isActive: true, expiryDate: { $gte: new Date() } });
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      message: "Customer dashboard stats fetched",
      data: {
        customerName: req.user.fullName,
        photo: req.user.photo,
        totalOrders,
        activeOrder,
        deliveredOrders,
        cancelledOrders,
        totalAmountSpent,
        savedAddresses,
        recentOrders,
        favouriteFoodItems,
        recommendedFoodItems: recommendedFoodItems.slice(0, 6),
        availableCoupons,
        notifications,
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/customer/orders
export const getCustomerOrders = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const customerObj = await getOrCreateCustomer(userId);
    const { status, search } = req.query;

    let query = { customerId: customerObj._id };
    if (status) {
      query.orderStatus = status;
    }

    let orders = await Order.find(query).sort({ createdAt: -1 }).populate("restaurantId").populate("riderId");

    if (search) {
      orders = orders.filter(o => 
        o._id.toString().includes(search) || 
        o.restaurantId?.restaurantName?.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.status(200).json({
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/customer/orders/:orderId
export const getCustomerOrderById = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid Order ID" });
    }

    const order = await Order.findById(orderId)
      .populate("restaurantId")
      .populate("riderId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verify ownership
    const customerObj = await getOrCreateCustomer(userId);
    if (order.customerId.toString() !== customerObj._id.toString()) {
      return res.status(403).json({ message: "Unauthorized access to this order" });
    }

    // Fetch food details since orderItems only saves itemId and quantity
    const menuData = await Menu.findOne({ restaurantId: order.restaurantId });
    const orderItemsWithDetails = order.orderItems.map(oi => {
      const itemDetail = menuData?.menuItems.find(mi => mi._id.toString() === oi.itemId.toString());
      return {
        ...oi.toObject(),
        detail: itemDetail || { itemName: "Unknown Item", price: 0 }
      };
    });

    // Populate rider details user model info
    let riderUser = null;
    if (order.riderId) {
      const riderObj = await mongoose.model("rider").findById(order.riderId).populate("riderId");
      if (riderObj) {
        riderUser = {
          fullName: riderObj.riderId?.fullName,
          phone: riderObj.riderId?.phone,
          photo: riderObj.riderId?.photo,
          vehicleDetails: riderObj.vehicleDetails,
        };
      }
    }

    res.status(200).json({
      message: "Order details fetched",
      data: {
        ...order.toObject(),
        orderItems: orderItemsWithDetails,
        riderDetails: riderUser,
      }
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/customer/orders/:orderId/cancel
export const cancelCustomerOrder = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const customerObj = await getOrCreateCustomer(userId);
    if (order.customerId.toString() !== customerObj._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to cancel this order" });
    }

    if (order.orderStatus !== "pending") {
      return res.status(400).json({ message: "Only pending orders can be cancelled" });
    }

    order.orderStatus = "cancelled";
    await order.save();

    await Notification.create({
      userId,
      title: "Order Cancelled",
      message: `Your order from ${orderId} has been cancelled successfully.`,
      type: "order"
    });

    res.status(200).json({ message: "Order cancelled successfully", data: order });
  } catch (error) {
    next(error);
  }
};

// POST /api/customer/orders/:orderId/reorder
export const reorderCustomerOrder = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.params;

    const oldOrder = await Order.findById(orderId);
    if (!oldOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    const customerObj = await getOrCreateCustomer(userId);
    
    // Create new order clone with pending status
    const newOrder = await Order.create({
      restaurantId: oldOrder.restaurantId,
      customerId: customerObj._id,
      orderItems: oldOrder.orderItems,
      orderStatus: "pending",
      billDetails: oldOrder.billDetails,
      deliveryAddress: oldOrder.deliveryAddress,
      paymentDetails: {
        paymentMethod: oldOrder.paymentDetails.paymentMethod,
        paymentStatus: "pending"
      }
    });

    res.status(201).json({ message: "Reordered successfully! Review payment to confirm.", data: newOrder });
  } catch (error) {
    next(error);
  }
};

// POST /api/customer/orders/:orderId/review
export const reviewCustomerOrder = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.params;
    const { restaurantRating, restaurantReview, riderRating, riderReview } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const customerObj = await getOrCreateCustomer(userId);
    if (order.customerId.toString() !== customerObj._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const reviewObj = await Review.create({
      orderId,
      customerId: req.user._id,
      restaurantId: order.restaurantId,
      riderId: order.riderId,
      restaurantRating,
      restaurantReview,
      riderRating,
      riderReview,
    });

    res.status(201).json({ message: "Review submitted successfully", data: reviewObj });
  } catch (error) {
    next(error);
  }
};

// GET /api/customer/addresses
export const getCustomerAddresses = async (req, res, next) => {
  try {
    const customerObj = await getOrCreateCustomer(req.user._id);
    res.status(200).json({ data: customerObj.addressBook });
  } catch (error) {
    next(error);
  }
};

// POST /api/customer/addresses
export const addCustomerAddress = async (req, res, next) => {
  try {
    const customerObj = await getOrCreateCustomer(req.user._id);
    const { name, address, city, state, pinCode, country, addressType, isDefault } = req.body;

    if (!name || !address || !city || !state || !pinCode || !country || !addressType) {
      return res.status(400).json({ message: "Missing address fields" });
    }

    if (isDefault) {
      customerObj.addressBook.forEach(a => a.isDefault = false);
    }

    customerObj.addressBook.push({
      name,
      address,
      city,
      state,
      pinCode,
      country,
      addressType,
      isDefault: isDefault || customerObj.addressBook.length === 0,
    });

    await customerObj.save();
    res.status(201).json({ message: "Address added successfully", data: customerObj.addressBook });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/customer/addresses/:addressId
export const updateCustomerAddress = async (req, res, next) => {
  try {
    const customerObj = await getOrCreateCustomer(req.user._id);
    const { addressId } = req.params;
    const updates = req.body;

    const addressIndex = customerObj.addressBook.findIndex(a => a._id.toString() === addressId);
    if (addressIndex === -1) {
      return res.status(404).json({ message: "Address not found" });
    }

    if (updates.isDefault) {
      customerObj.addressBook.forEach(a => a.isDefault = false);
    }

    const currentAddress = customerObj.addressBook[addressIndex];
    Object.keys(updates).forEach(key => {
      if (key !== "_id") {
        currentAddress[key] = updates[key];
      }
    });

    await customerObj.save();
    res.status(200).json({ message: "Address updated successfully", data: customerObj.addressBook });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/customer/addresses/:addressId
export const deleteCustomerAddress = async (req, res, next) => {
  try {
    const customerObj = await getOrCreateCustomer(req.user._id);
    const { addressId } = req.params;

    customerObj.addressBook = customerObj.addressBook.filter(a => a._id.toString() !== addressId);
    await customerObj.save();

    res.status(200).json({ message: "Address deleted successfully", data: customerObj.addressBook });
  } catch (error) {
    next(error);
  }
};

// GET /api/customer/favourites
export const getCustomerFavourites = async (req, res, next) => {
  try {
    const customerObj = await getOrCreateCustomer(req.user._id);
    const allMenus = await Menu.find({});
    const itemsMap = {};
    
    allMenus.forEach(menu => {
      menu.menuItems.forEach(item => {
        itemsMap[item._id.toString()] = {
          ...item.toObject(),
          restaurantId: menu.restaurantId,
        };
      });
    });

    const favourites = (customerObj.favourites || [])
      .map(id => itemsMap[id.toString()])
      .filter(Boolean);

    res.status(200).json({ data: favourites });
  } catch (error) {
    next(error);
  }
};

// POST /api/customer/favourites/:foodId
export const addCustomerFavourite = async (req, res, next) => {
  try {
    const customerObj = await getOrCreateCustomer(req.user._id);
    const { foodId } = req.params;

    if (!customerObj.favourites.includes(foodId)) {
      customerObj.favourites.push(foodId);
      await customerObj.save();
    }

    res.status(200).json({ message: "Added to favorites", data: customerObj.favourites });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/customer/favourites/:foodId
export const deleteCustomerFavourite = async (req, res, next) => {
  try {
    const customerObj = await getOrCreateCustomer(req.user._id);
    const { foodId } = req.params;

    customerObj.favourites = customerObj.favourites.filter(id => id.toString() !== foodId);
    await customerObj.save();

    res.status(200).json({ message: "Removed from favorites", data: customerObj.favourites });
  } catch (error) {
    next(error);
  }
};
