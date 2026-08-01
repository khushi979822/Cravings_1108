import express from "express";
import {
  ContactUsForm,
  getPublicRestaurants,
  getPublicRestaurantDetail,
} from "../controllers/public.controller.js";

const router = express.Router();

router.post("/contact-us", ContactUsForm);
router.get("/restaurants", getPublicRestaurants);
router.get("/restaurant-detail/:restaurantId", getPublicRestaurantDetail);

export default router;
