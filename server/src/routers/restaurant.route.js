import express from "express";
import multer from "multer";
import {
  RestaurantUpdateProfile,
  RestaurantGetData,
  RestaurantUpdateInfo,
  OpenRestaurant,
  RestaurantUpdateLegalInfo,
  getRestaurantMenu,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  RestaurantUpdateAddress,
  RestaurantUpdateBankingDocuments,
  RestaurantUpdateSocialMediaLinks,
  RestaurantUpdateCoverPhoto,
  RestaurantUpdateRestaurantImages,
} from "../controllers/restaurant.controller.js";
import { RestaurantAuthProtect } from "../middleware/auth.middleware.js";

const upload = multer();
const router = express.Router();

router.post(
  "/update-profile",
  RestaurantAuthProtect,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "restaurantImage", maxCount: 10 },
  ]),
  RestaurantUpdateProfile,
);

router.get("/get-resturant-data", RestaurantAuthProtect, RestaurantGetData);

router.put(
  "/update-restaurant-info",
  RestaurantAuthProtect,
  RestaurantUpdateInfo,
);

router.patch(
  "/change-open-status/:openStatus",
  RestaurantAuthProtect,
  OpenRestaurant,
);

router.put(
  "/update-legal-info",
  RestaurantAuthProtect,
  RestaurantUpdateLegalInfo,
);

// Menu management routes
router.get("/menu", RestaurantAuthProtect, getRestaurantMenu);
router.get("/menu-items", RestaurantAuthProtect, getRestaurantMenu);

router.post(
  "/menu/item",
  RestaurantAuthProtect,
  upload.single("image"),
  addMenuItem,
);
router.post(
  "/add-menu-item",
  RestaurantAuthProtect,
  upload.single("itemImage"),
  addMenuItem,
);

router.put(
  "/menu/item/:itemId",
  RestaurantAuthProtect,
  upload.single("image"),
  updateMenuItem,
);
router.put(
  "/menu-item/:itemId",
  RestaurantAuthProtect,
  upload.single("itemImage"),
  updateMenuItem,
);

router.delete(
  "/menu/item/:itemId",
  RestaurantAuthProtect,
  deleteMenuItem,
);
router.delete(
  "/menu-item/:itemId",
  RestaurantAuthProtect,
  deleteMenuItem,
);

// Core details & photos routes
router.put("/update-address", RestaurantAuthProtect, RestaurantUpdateAddress);
router.put(
  "/update-banking-documents",
  RestaurantAuthProtect,
  RestaurantUpdateBankingDocuments,
);
router.put(
  "/update-social-media-links",
  RestaurantAuthProtect,
  RestaurantUpdateSocialMediaLinks,
);
router.put(
  "/update-cover-photo",
  RestaurantAuthProtect,
  upload.single("coverImage"),
  RestaurantUpdateCoverPhoto,
);
router.put(
  "/update-restaurant-images",
  RestaurantAuthProtect,
  upload.array("restaurantImages", 8),
  RestaurantUpdateRestaurantImages,
);

export default router;
