import express from "express";
import {
  getCustomerDashboard,
  getCustomerOrders,
  getCustomerOrderById,
  cancelCustomerOrder,
  reorderCustomerOrder,
  reviewCustomerOrder,
  getCustomerAddresses,
  addCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress,
  getCustomerFavourites,
  addCustomerFavourite,
  deleteCustomerFavourite,
} from "../controllers/customer.controller.js";
import { AuthProtect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(AuthProtect); // Protect all customer routes

router.get("/dashboard", getCustomerDashboard);
router.get("/orders", getCustomerOrders);
router.get("/orders/:orderId", getCustomerOrderById);
router.patch("/orders/:orderId/cancel", cancelCustomerOrder);
router.post("/orders/:orderId/reorder", reorderCustomerOrder);
router.post("/orders/:orderId/review", reviewCustomerOrder);

router.get("/addresses", getCustomerAddresses);
router.post("/addresses", addCustomerAddress);
router.patch("/addresses/:addressId", updateCustomerAddress);
router.delete("/addresses/:addressId", deleteCustomerAddress);

router.get("/favourites", getCustomerFavourites);
router.post("/favourites/:foodId", addCustomerFavourite);
router.delete("/favourites/:foodId", deleteCustomerFavourite);

export default router;
