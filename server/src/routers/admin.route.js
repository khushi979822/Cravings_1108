import express from "express";
import {
  getAdminDashboard,
  getAdminOrders,
  getAdminOrderById,
  updateAdminOrderStatus,
  assignAdminRider,
  getAdminCustomers,
  updateAdminCustomerStatus,
  getAdminRiders,
  createAdminRider,
  updateAdminRider,
  updateAdminRiderStatus,
  getAdminRestaurants,
  createAdminRestaurant,
  updateAdminRestaurant,
  deleteAdminRestaurant,
  getAdminFoods,
  createAdminFood,
  updateAdminFood,
  deleteAdminFood,
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
  getAdminCoupons,
  createAdminCoupon,
  updateAdminCoupon,
  deleteAdminCoupon,
  getAdminReports
} from "../controllers/admin.controller.js";
import { AuthProtect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(AuthProtect); // Protect all admin routes

router.get("/dashboard", getAdminDashboard);
router.get("/orders", getAdminOrders);
router.get("/orders/:orderId", getAdminOrderById);
router.patch("/orders/:orderId/status", updateAdminOrderStatus);
router.patch("/orders/:orderId/assign-rider", assignAdminRider);

router.get("/customers", getAdminCustomers);
router.patch("/customers/:userId/status", updateAdminCustomerStatus);

router.get("/riders", getAdminRiders);
router.post("/riders", createAdminRider);
router.patch("/riders/:riderId", updateAdminRider);
router.patch("/riders/:riderId/status", updateAdminRiderStatus);

router.get("/restaurants", getAdminRestaurants);
router.post("/restaurants", createAdminRestaurant);
router.patch("/restaurants/:restaurantId", updateAdminRestaurant);
router.delete("/restaurants/:restaurantId", deleteAdminRestaurant);

router.get("/foods", getAdminFoods);
router.post("/foods", createAdminFood);
router.patch("/foods/:foodId", updateAdminFood);
router.delete("/foods/:foodId", deleteAdminFood);

router.get("/categories", getAdminCategories);
router.post("/categories", createAdminCategory);
router.patch("/categories/:categoryId", updateAdminCategory);
router.delete("/categories/:categoryId", deleteAdminCategory);

router.get("/coupons", getAdminCoupons);
router.post("/coupons", createAdminCoupon);
router.patch("/coupons/:couponId", updateAdminCoupon);
router.delete("/coupons/:couponId", deleteAdminCoupon);

router.get("/reports", getAdminReports);

export default router;
