import express from "express";
import { ContactUsForm, getPublicRestaurants } from "../controllers/public.controller.js";

const router = express.Router();

router.post("/contact-us", ContactUsForm);
router.get("/restaurants", getPublicRestaurants);

export default router;
