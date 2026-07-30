import Restaurant from "../models/restaurant.model.js";
import Menu from "../models/menu.model.js";

export const RestaurantGetData = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const managerId = req.query.id;

    console.log("Current User:", currentUser);
    console.log("Manager ID:", managerId);

    if (currentUser._id.toString() !== managerId) {
      const error = new Error("Unauthorized Access");
      error.statusCode = 401;
      return next(error);
    }

    const restaurantData = await Restaurant.findOne({ managerId });

    if (restaurantData) {
      res.status(200).json({
        message: "Restaurant Fetched Successfully",
        data: restaurantData,
      });
    } else {
      res.status(200).json({
        message: "No restaurant Data Found",
        data: {},
      });
    }
  } catch (error) {
    console.log(error.message);
    next();
  }
};

export const RestaurantUpdateProfile = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const restaurantDataFromFE = req.body || {};
    
    // Support multer fields array, single file, or req.file
    const coverImageFile = Array.isArray(req.files?.coverImage)
      ? req.files.coverImage[0]
      : (req.files?.coverImage || req.file);
      
    const restaurantImageFiles = req.files?.restaurantImage;

    let existingRestaurant = await Restaurant.findOne({
      managerId: currentUser._id,
    });

    if (!existingRestaurant) {
      let coverImage = null;
      let restaurantImage = [];

      if (coverImageFile) {
        coverImage = await uploadSingleImage(
          coverImageFile,
          `restaurant/${currentUser.phone}/coverPhoto`,
        );
      }

      if (restaurantImageFiles && restaurantImageFiles.length > 0) {
        restaurantImage = await uploadMultipleImages(
          restaurantImageFiles,
          `restaurant/${currentUser.phone}/restaurantPhotos`,
        );
      }

      existingRestaurant = await Restaurant.create({
        managerId: currentUser._id,
        restaurantName: restaurantDataFromFE.restaurantName || `${currentUser.fullName || "My"}'s Kitchen`,
        coverImage,
        restaurantImage,
        ...restaurantDataFromFE,
      });

      return res.status(201).json({
        message: "Restaurant profile created successfully",
        data: existingRestaurant,
      });
    } else {
      if (coverImageFile) {
        if (existingRestaurant.coverImage) {
          await deleteSingleImage(existingRestaurant.coverImage);
        }
        const coverImage = await uploadSingleImage(
          coverImageFile,
          `restaurant/${currentUser.phone}/coverPhoto`,
        );
        existingRestaurant.coverImage = coverImage;
      }

      if (restaurantImageFiles && restaurantImageFiles.length > 0) {
        const newImages = await uploadMultipleImages(
          restaurantImageFiles,
          `restaurant/${currentUser.phone}/restaurantPhotos`,
        );
        // Combine or set restaurant images
        existingRestaurant.restaurantImage = [
          ...(existingRestaurant.restaurantImage || []),
          ...newImages,
        ];
      }

      // Update remaining fields from req.body if provided
      Object.keys(restaurantDataFromFE).forEach((key) => {
        if (restaurantDataFromFE[key]) {
          existingRestaurant[key] = restaurantDataFromFE[key];
        }
      });

      await existingRestaurant.save();

      return res.status(200).json({
        message: "Restaurant profile updated successfully",
        data: existingRestaurant,
      });
    }
  } catch (error) {
    console.error("Error in RestaurantUpdateProfile:", error);
    next(error);
  }
};

export const RestaurantUpdateInfo = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const {
      restaurantName,
      description,
      restaurantType,
      cuisineTypes,
      contactEmail,
      contactPhone,
      openingTime,
      closingTime,
    } = req.body;

    if (
      !restaurantName ||
      !description ||
      !restaurantType ||
      !cuisineTypes ||
      !contactEmail ||
      !contactPhone ||
      !openingTime ||
      !closingTime
    ) {
      const error = new Error("All fields are required");
      error.statusCode = 400;
      return next(error);
    }

    const cuisineTypesArray = cuisineTypes
      .split(",")
      .map((type) => type.trim());
    const existingRestaurant = await Restaurant.findOne({
      managerId: currentUser._id,
    });
    if (!existingRestaurant) {
      const newRestaurant = await Restaurant.create({
        managerId: currentUser._id,
        restaurantName,
        description,
        restaurantType,
        cuisineTypes: cuisineTypesArray,
        contactDetails: {
          email: contactEmail,
          phone: contactPhone,
        },
        servingHours: {
          openingTime,
          closingTime,
        },
      });
      return res.status(201).json({
        message: "Restaurant profile created successfully",
        data: newRestaurant,
      });
    } else {
      existingRestaurant.restaurantName = restaurantName;
      existingRestaurant.description = description;
      existingRestaurant.restaurantType = restaurantType;
      existingRestaurant.cuisineTypes = cuisineTypesArray;
      existingRestaurant.contactDetails.email = contactEmail;
      existingRestaurant.contactDetails.phone = contactPhone;
      existingRestaurant.servingHours.openingTime = openingTime;
      existingRestaurant.servingHours.closingTime = closingTime;
      await existingRestaurant.save();
      return res.status(200).json({
        message: "Restaurant profile updated successfully",
        data: existingRestaurant,
      });
    }
  } catch (error) {
    console.log(error.message);
    next();
  }
};

export const OpenRestaurant = async (req, res, next) => {
  try {
    const currentUser = req.user;

    const OpenStatus = req.params.openStatus;

    console.log("Open Status is", OpenStatus);

    const existingRestaurant = await Restaurant.findOne({
      managerId: currentUser._id,
    });

    if (!existingRestaurant) {
      const error = new Error("Restaurant Not Found");
      error.statusCode = 404;
      return next(error);
    }

    existingRestaurant.isOpen = OpenStatus;

    await existingRestaurant.save();

    return res.status(200).json({
      message: `${OpenStatus ? "Restaurant is Live Now" : "Restaurant is Offline"}`,
      data: existingRestaurant,
    });
  } catch (error) {
    console.log(error.message);
    next();
  }
};

export const RestaurantUpdateLegalInfo = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const { legalName, companyType } = req.body;

    if (!legalName || !companyType) {
      const error = new Error("All fields are required");
      error.statusCode = 400;
      return next(error);
    }

    const existingRestaurant = await Restaurant.findOne({
      managerId: currentUser._id,
    });

    if (!existingRestaurant) {
      const error = new Error("Restaurant Not Found");
      error.statusCode = 404;
      return next(error);
    }

    existingRestaurant.legal = {
      legalName,
      companyType,
    };

    await existingRestaurant.save();

    return res.status(200).json({
      message: "Legal information updated successfully",
      data: existingRestaurant,
    });
  } catch (error) {
    console.log(error.message);
    next();
  }
};

const findOrCreateRestaurantForManager = async (currentUser) => {
  let existingRestaurant = await Restaurant.findOne({
    managerId: currentUser._id,
  });

  if (!existingRestaurant) {
    existingRestaurant = await Restaurant.create({
      managerId: currentUser._id,
      restaurantName: currentUser.fullName ? `${currentUser.fullName}'s Kitchen` : "My Restaurant",
      description: "Welcome to our restaurant! Enjoy fresh & delicious meals.",
      cuisineTypes: ["Multi-Cuisine"],
      restaurantType: "both",
      contactDetails: {
        email: currentUser.email || "manager@cravings.com",
        phone: currentUser.phone || "0000000000",
      },
      servingHours: {
        openingTime: "09:00 AM",
        closingTime: "10:00 PM",
      },
      isOpen: true,
      status: "active",
    });
  }

  return existingRestaurant;
};

export const getRestaurantMenu = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const existingRestaurant = await findOrCreateRestaurantForManager(currentUser);

    let menu = await Menu.findOne({ restaurantId: existingRestaurant._id });
    if (!menu) {
      menu = await Menu.create({
        restaurantId: existingRestaurant._id,
        menuItems: [],
      });
    }

    return res.status(200).json({
      message: "Menu fetched successfully",
      data: menu.menuItems.filter((item) => !item.isDeleted),
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const addMenuItem = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const existingRestaurant = await findOrCreateRestaurantForManager(currentUser);

    let menu = await Menu.findOne({ restaurantId: existingRestaurant._id });
    if (!menu) {
      menu = await Menu.create({
        restaurantId: existingRestaurant._id,
        menuItems: [],
      });
    }

    const {
      itemName,
      description,
      price,
      category,
      type,
      status,
      isTopRated,
      isRecommended,
      isNew,
    } = req.body;

    if (!itemName || !price || !category) {
      const error = new Error("Item name, price, and category are required");
      error.statusCode = 400;
      return next(error);
    }

    let imageObj = {
      url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=600&fit=crop",
      publicId: `default-${Date.now()}`,
    };

    if (req.file) {
      imageObj = await uploadSingleImage(
        req.file,
        `restaurant/${existingRestaurant._id}/menu`,
      );
    } else if (req.body.image) {
      try {
        imageObj = typeof req.body.image === "string" ? JSON.parse(req.body.image) : req.body.image;
      } catch (e) {
        if (typeof req.body.image === "string") {
          imageObj = { url: req.body.image, publicId: `url-${Date.now()}` };
        }
      }
    }

    const newItem = {
      itemName: itemName.trim(),
      description: description ? description.trim() : "",
      price: parseFloat(price),
      category: category.trim(),
      type: type || "Vegetarian",
      status: status || "available",
      image: imageObj,
      isAvailable: status !== "unavailable" && status !== "discontinued",
      isTopRated: isTopRated === "true" || isTopRated === true,
      isRecommended: isRecommended === "true" || isRecommended === true,
      isNew: isNew === "true" || isNew === true,
      isDeleted: false,
    };

    menu.menuItems.push(newItem);
    await menu.save();

    const addedItem = menu.menuItems[menu.menuItems.length - 1];

    return res.status(201).json({
      message: "Menu item added successfully",
      data: addedItem,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const updateMenuItem = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const { itemId } = req.params;

    const existingRestaurant = await findOrCreateRestaurantForManager(currentUser);

    const menu = await Menu.findOne({
      restaurantId: existingRestaurant._id,
      "menuItems._id": itemId,
    });

    if (!menu) {
      const error = new Error("Menu item not found");
      error.statusCode = 404;
      return next(error);
    }

    const item = menu.menuItems.id(itemId);
    if (!item) {
      const error = new Error("Menu item not found");
      error.statusCode = 404;
      return next(error);
    }

    const {
      itemName,
      description,
      price,
      category,
      type,
      status,
      isTopRated,
      isRecommended,
      isNew,
      isDeleted,
    } = req.body;

    if (itemName !== undefined) item.itemName = itemName.trim();
    if (description !== undefined) item.description = description.trim();
    if (price !== undefined) item.price = parseFloat(price);
    if (category !== undefined) item.category = category.trim();
    if (type !== undefined) item.type = type;
    if (status !== undefined) {
      item.status = status;
      item.isAvailable = status === "available";
    }
    if (isTopRated !== undefined) item.isTopRated = isTopRated === "true" || isTopRated === true;
    if (isRecommended !== undefined) item.isRecommended = isRecommended === "true" || isRecommended === true;
    if (isNew !== undefined) item.isNew = isNew === "true" || isNew === true;
    if (isDeleted !== undefined) item.isDeleted = isDeleted === "true" || isDeleted === true;

    if (req.file) {
      if (item.image?.publicId && !item.image.publicId.startsWith("default-")) {
        await deleteSingleImage(item.image).catch(() => {});
      }
      const imageObj = await uploadSingleImage(
        req.file,
        `restaurant/${existingRestaurant._id}/menu`,
      );
      item.image = imageObj;
    } else if (req.body.image) {
      try {
        const parsed = typeof req.body.image === "string" ? JSON.parse(req.body.image) : req.body.image;
        if (parsed.url) item.image = parsed;
      } catch (e) {
        if (typeof req.body.image === "string" && req.body.image.startsWith("http")) {
          item.image = { url: req.body.image, publicId: `url-${Date.now()}` };
        }
      }
    }

    await menu.save();

    return res.status(200).json({
      message: "Menu item updated successfully",
      data: item,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const deleteMenuItem = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const { itemId } = req.params;

    const existingRestaurant = await findOrCreateRestaurantForManager(currentUser);

    const menu = await Menu.findOne({
      restaurantId: existingRestaurant._id,
      "menuItems._id": itemId,
    });

    if (!menu) {
      const error = new Error("Menu item not found");
      error.statusCode = 404;
      return next(error);
    }

    const item = menu.menuItems.id(itemId);
    if (item && item.image?.publicId && !item.image.publicId.startsWith("default-")) {
      await deleteSingleImage(item.image).catch(() => {});
    }

    menu.menuItems = menu.menuItems.filter((i) => i._id.toString() !== itemId);
    await menu.save();

    return res.status(200).json({
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

