import express from "express";
import {
  getRiderDashboard,
  toggleRiderAvailability,
  getRiderDeliveryRequests,
  acceptRiderDelivery,
  rejectRiderDelivery,
  getRiderCurrentOrder,
  updateRiderOrderStatus,
  getRiderDeliveryHistory,
  getRiderEarnings,
  updateRiderLocation,
  updateRiderProfile,
} from "../controllers/rider.controller.js";
import { AuthProtect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(AuthProtect); // Protect all rider routes

router.get("/dashboard", getRiderDashboard);
router.patch("/availability", toggleRiderAvailability);
router.get("/delivery-requests", getRiderDeliveryRequests);
router.patch("/orders/:orderId/accept", acceptRiderDelivery);
router.patch("/orders/:orderId/reject", rejectRiderDelivery);
router.get("/current-order", getRiderCurrentOrder);
router.patch("/orders/:orderId/status", updateRiderOrderStatus);
router.get("/delivery-history", getRiderDeliveryHistory);
router.get("/earnings", getRiderEarnings);
router.patch("/location", updateRiderLocation);
router.patch("/profile", updateRiderProfile);

export default router;
