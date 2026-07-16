import User from "../models/user.model.js";
import Customer from "../models/customer.model.js";
import Rider from "../models/rider.model.js";
import Restaurant from "../models/restaurant.model.js";
import Order from "../models/order.model.js";
import Menu from "../models/menu.model.js";
import Category from "../models/category.model.js";
import Coupon from "../models/coupon.model.js";
import Review from "../models/review.model.js";
import Notification from "../models/notification.model.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Helper check admin role
const verifyAdmin = (user) => {
  return user && user.userType === "admin";
};

// GET /api/admin/dashboard
export const getAdminDashboard = async (req, res, next) => {
  try {
    if (!verifyAdmin(req.user)) {
      return res.status(403).json({ message: "Unauthorized. Admin role required." });
    }

    const totalCustomers = await User.countDocuments({ userType: "customer" });
    const totalRiders = await User.countDocuments({ userType: "rider" });
    const totalRestaurants = await Restaurant.countDocuments({});
    
    // Count total food items across all menus
    const menus = await Menu.find({});
    let totalFoodItems = 0;
    menus.forEach(m => totalFoodItems += m.menuItems.length);

    const orders = await Order.find({});
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.orderStatus === "pending").length;
    const activeOrders = orders.filter(o => 
      !["delivered", "cancelled", "failed", "rejected"].includes(o.orderStatus)
    ).length;
    const deliveredOrders = orders.filter(o => o.orderStatus === "delivered").length;
    const cancelledOrders = orders.filter(o => o.orderStatus === "cancelled").length;

    const completedOrders = orders.filter(o => o.paymentDetails?.paymentStatus === "completed");
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.billDetails.finalAmount, 0);

    // Calculate Today's Revenue
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = completedOrders.filter(o => new Date(o.createdAt) >= today);
    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.billDetails.finalAmount, 0);

    // Calculate Monthly Revenue
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthlyOrders = completedOrders.filter(o => new Date(o.createdAt) >= startOfMonth);
    const monthlyRevenue = monthlyOrders.reduce((sum, o) => sum + o.billDetails.finalAmount, 0);

    const averageOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;

    // Charts & aggregation mocks or aggregations
    // Daily Orders mock helper (last 7 days)
    const dailyOrders = [];
    const statusDistribution = {
      pending: pendingOrders,
      active: activeOrders,
      delivered: deliveredOrders,
      cancelled: cancelledOrders
    };

    res.status(200).json({
      message: "Admin dashboard stats fetched successfully",
      data: {
        totalCustomers,
        totalRiders,
        totalRestaurants,
        totalFoodItems,
        totalOrders,
        pendingOrders,
        activeOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue,
        todayRevenue,
        monthlyRevenue,
        averageOrderValue,
        dailyOrders: [
          { date: "Mon", orders: Math.min(totalOrders, 5) },
          { date: "Tue", orders: Math.min(totalOrders, 8) },
          { date: "Wed", orders: Math.min(totalOrders, 12) },
          { date: "Thu", orders: Math.min(totalOrders, 10) },
          { date: "Fri", orders: Math.min(totalOrders, 15) },
          { date: "Sat", orders: Math.min(totalOrders, 20) },
          { date: "Sun", orders: Math.min(totalOrders, 18) }
        ],
        statusDistribution,
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/orders
export const getAdminOrders = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    let query = {};
    if (status) {
      query.orderStatus = status;
    }

    let orders = await Order.find(query)
      .populate("restaurantId")
      .populate("riderId")
      .sort({ createdAt: -1 });

    if (search) {
      orders = orders.filter(o => 
        o._id.toString().includes(search) || 
        o.restaurantId?.restaurantName?.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.status(200).json({ data: orders });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/orders/:orderId
export const getAdminOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
      .populate("restaurantId")
      .populate("riderId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
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

// PATCH /api/admin/orders/:orderId/status
export const updateAdminOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = status;
    await order.save();

    // Alert Customer
    const customerObj = await Customer.findById(order.customerId).populate("customerId");
    if (customerObj && customerObj.customerId) {
      await Notification.create({
        userId: customerObj.customerId._id,
        title: "Order Status Updated",
        message: `Your order status has been updated to ${status}.`,
        type: "order"
      });
    }

    res.status(200).json({ message: "Order status updated successfully", data: order });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/orders/:orderId/assign-rider
export const assignAdminRider = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { riderId } = req.body; // Rider's profile _id

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (riderId) {
      order.riderId = riderId;
      order.orderStatus = "accepted"; // update to accepted when rider assigned
    } else {
      order.riderId = undefined;
    }

    await order.save();
    res.status(200).json({ message: "Rider assigned successfully", data: order });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/customers
export const getAdminCustomers = async (req, res, next) => {
  try {
    const users = await User.find({ userType: "customer" }).select("-password");
    
    // Combine with Customer profile information
    const customersWithProfiles = [];
    for (const u of users) {
      const profile = await Customer.findOne({ customerId: u._id });
      customersWithProfiles.push({
        ...u.toObject(),
        profile: profile || { isActive: true, status: "verified" }
      });
    }

    res.status(200).json({ data: customersWithProfiles });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/customers/:userId/status
export const updateAdminCustomerStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { isActive, status } = req.body;

    let customerProfile = await Customer.findOne({ customerId: userId });
    if (!customerProfile) {
      customerProfile = await Customer.create({
        customerId: userId,
        addressBook: [],
        isActive: true,
        status: "verified"
      });
    }

    if (isActive !== undefined) customerProfile.isActive = isActive;
    if (status !== undefined) customerProfile.status = status;

    await customerProfile.save();
    res.status(200).json({ message: "Customer status updated successfully", data: customerProfile });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/riders
export const getAdminRiders = async (req, res, next) => {
  try {
    const users = await User.find({ userType: "rider" }).select("-password");
    
    const ridersWithProfiles = [];
    for (const u of users) {
      const profile = await Rider.findOne({ riderId: u._id });
      ridersWithProfiles.push({
        ...u.toObject(),
        profile: profile || { status: "inactive" }
      });
    }
    
    res.status(200).json({ data: ridersWithProfiles });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/riders
export const createAdminRider = async (req, res, next) => {
  try {
    const { fullName, email, phone, dob, gender, password, vehicleDetails, currentAddress, financialDetails } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password || "Rider@123", 10);
    const userObj = await User.create({
      fullName,
      email,
      phone,
      dob,
      gender,
      password: hashedPassword,
      userType: "rider",
      photo: { url: `https://placehold.co/600x400?text=${fullName.charAt(0)}`, publicId: null }
    });

    const riderProfile = await Rider.create({
      riderId: userObj._id,
      vehicleDetails,
      currentAddress,
      financialDetails,
      documents: {
        drivingLicense: "dummy",
        vehicleRegistrationCertificate: "dummy",
        insuranceCertificate: "dummy",
        aadharCard: "dummy",
        panCard: "dummy"
      },
      status: "active"
    });

    res.status(201).json({ message: "Rider account created successfully", data: { user: userObj, profile: riderProfile } });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/riders/:riderId
export const updateAdminRider = async (req, res, next) => {
  try {
    const { riderId } = req.params; // User Id or Rider Id
    const updates = req.body;

    let profile = await Rider.findOne({ riderId });
    if (!profile) {
      profile = await Rider.findById(riderId);
    }

    if (!profile) {
      return res.status(404).json({ message: "Rider profile not found" });
    }

    if (updates.vehicleDetails) profile.vehicleDetails = updates.vehicleDetails;
    if (updates.currentAddress) profile.currentAddress = updates.currentAddress;
    if (updates.financialDetails) profile.financialDetails = updates.financialDetails;
    if (updates.status) profile.status = updates.status;

    await profile.save();
    res.status(200).json({ message: "Rider profile updated", data: profile });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/riders/:riderId/status
export const updateAdminRiderStatus = async (req, res, next) => {
  try {
    const { riderId } = req.params; // User ID
    const { status, isAvailable } = req.body;

    let profile = await Rider.findOne({ riderId });
    if (!profile) {
      profile = await Rider.create({
        riderId,
        vehicleDetails: { vehicleType: "Bike", vehicleNumber: "DL-1234", vehicleModel: "Splendor", vehicleColor: "Black" },
        currentAddress: { address: "Delhi", city: "Delhi", state: "Delhi", pinCode: "110001", country: "India" },
        financialDetails: { bankName: "SBI", accountNumber: "123456", ifscCode: "SBIN01" },
        documents: { drivingLicense: "dummy", vehicleRegistrationCertificate: "dummy", insuranceCertificate: "dummy", aadharCard: "dummy", panCard: "dummy" }
      });
    }

    if (status) profile.status = status;
    if (isAvailable !== undefined) profile.isAvailable = isAvailable;

    await profile.save();
    res.status(200).json({ message: "Rider status updated", data: profile });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/restaurants
export const getAdminRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find({}).populate("managerId", "-password");
    res.status(200).json({ data: restaurants });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/restaurants
export const createAdminRestaurant = async (req, res, next) => {
  try {
    const { managerId, restaurantName, address, city, state, pinCode, country, cuisineTypes, restaurantType, description } = req.body;

    const restaurant = await Restaurant.create({
      managerId,
      restaurantName,
      address,
      city,
      state,
      pinCode,
      country,
      cuisineTypes: cuisineTypes.split(",").map(c => c.trim()),
      restaurantType,
      description,
      documents: { legalName: restaurantName, companyType: "Private", gstCertificate: "dummy", fssaiCertificate: "dummy", panCard: "dummy" },
      financialDetails: { bankName: "SBI", accountNumber: "12345", ifscCode: "SBIN01" },
      contactDetails: { email: "restaurant@cravings.com", phone: "9999999999" },
      servingHours: { openingTime: "09:00", closingTime: "22:00" },
      coverImage: { url: "https://placehold.co/600x400?text=Cover", publicId: "dummy" },
      restaurantImage: [{ url: "https://placehold.co/600x400?text=Image", publicId: "dummy" }],
      isOpen: true,
      status: "active"
    });

    res.status(201).json({ message: "Restaurant added successfully", data: restaurant });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/restaurants/:restaurantId
export const updateAdminRestaurant = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const updates = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    Object.keys(updates).forEach(key => {
      restaurant[key] = updates[key];
    });

    await restaurant.save();
    res.status(200).json({ message: "Restaurant updated successfully", data: restaurant });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/restaurants/:restaurantId
export const deleteAdminRestaurant = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    await Restaurant.findByIdAndDelete(restaurantId);
    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/foods
export const getAdminFoods = async (req, res, next) => {
  try {
    const menus = await Menu.find({}).populate("restaurantId");
    let allFoods = [];
    menus.forEach(m => {
      m.menuItems.forEach(item => {
        allFoods.push({
          ...item.toObject(),
          restaurantId: m.restaurantId?._id,
          restaurantName: m.restaurantId?.restaurantName,
          menuId: m._id,
        });
      });
    });

    res.status(200).json({ data: allFoods });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/foods
export const createAdminFood = async (req, res, next) => {
  try {
    const { restaurantId, itemName, description, price, category } = req.body;

    let menu = await Menu.findOne({ restaurantId });
    if (!menu) {
      menu = await Menu.create({
        restaurantId,
        menuItems: []
      });
    }

    const newItem = {
      itemName,
      description,
      price: Number(price),
      category,
      image: { url: "https://placehold.co/600x400?text=Food", publicId: "dummy" },
      isAvailable: true,
    };

    menu.menuItems.push(newItem);
    await menu.save();

    res.status(201).json({ message: "Food item created successfully", data: menu });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/foods/:foodId
export const updateAdminFood = async (req, res, next) => {
  try {
    const { foodId } = req.params;
    const { itemName, description, price, category, isAvailable } = req.body;

    const menu = await Menu.findOne({ "menuItems._id": foodId });
    if (!menu) {
      return res.status(404).json({ message: "Food item not found" });
    }

    const item = menu.menuItems.id(foodId);
    if (itemName) item.itemName = itemName;
    if (description) item.description = description;
    if (price !== undefined) item.price = Number(price);
    if (category) item.category = category;
    if (isAvailable !== undefined) item.isAvailable = isAvailable;

    await menu.save();
    res.status(200).json({ message: "Food item updated successfully", data: item });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/foods/:foodId
export const deleteAdminFood = async (req, res, next) => {
  try {
    const { foodId } = req.params;
    const menu = await Menu.findOne({ "menuItems._id": foodId });
    if (!menu) {
      return res.status(404).json({ message: "Food item not found" });
    }

    menu.menuItems = menu.menuItems.filter(item => item._id.toString() !== foodId);
    await menu.save();

    res.status(200).json({ message: "Food item deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/categories
export const getAdminCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({});
    res.status(200).json({ data: categories });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/categories
export const createAdminCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const category = await Category.create({ name, description });
    res.status(201).json({ message: "Category created successfully", data: category });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/categories/:categoryId
export const updateAdminCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { name, description, isActive } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (name) category.name = name;
    if (description) category.description = description;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();
    res.status(200).json({ message: "Category updated successfully", data: category });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/categories/:categoryId
export const deleteAdminCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    await Category.findByIdAndDelete(categoryId);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/coupons
export const getAdminCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find({});
    res.status(200).json({ data: coupons });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/coupons
export const createAdminCoupon = async (req, res, next) => {
  try {
    const { code, discountType, discountValue, minOrderAmount, expiryDate } = req.body;
    const coupon = await Coupon.create({ code, discountType, discountValue, minOrderAmount, expiryDate });
    res.status(201).json({ message: "Coupon created successfully", data: coupon });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/coupons/:couponId
export const updateAdminCoupon = async (req, res, next) => {
  try {
    const { couponId } = req.params;
    const updates = req.body;

    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    Object.keys(updates).forEach(key => {
      coupon[key] = updates[key];
    });

    await coupon.save();
    res.status(200).json({ message: "Coupon updated successfully", data: coupon });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/coupons/:couponId
export const deleteAdminCoupon = async (req, res, next) => {
  try {
    const { couponId } = req.params;
    await Coupon.findByIdAndDelete(couponId);
    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/reports
export const getAdminReports = async (req, res, next) => {
  try {
    const totalOrdersCount = await Order.countDocuments({});
    const totalEarnings = await Order.aggregate([
      { $match: { "paymentDetails.paymentStatus": "completed" } },
      { $group: { _id: null, total: { $sum: "$billDetails.finalAmount" } } }
    ]);

    const activeRestaurants = await Restaurant.countDocuments({ status: "active" });

    res.status(200).json({
      data: {
        totalOrders: totalOrdersCount,
        revenue: totalEarnings[0]?.total || 0,
        activeRestaurants,
        reportGeneratedAt: new Date(),
      }
    });
  } catch (error) {
    next(error);
  }
};
