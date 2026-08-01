import Contact from "../models/contact.model.js";
import Restaurant from "../models/restaurant.model.js";
import Menu from "../models/menu.model.js";

export const ContactUsForm = async (req, res, next) => {
  try {
    const { fullName, email, phone, subject, message } = req.body;
    if (!fullName || !email || !phone || !subject || !message) {
      const error = new Error("All fields Required");
      error.statusCode = 400;
      return next(error);
    }

    const NewContactMessage = await Contact.create({
      fullName,
      email,
      phone,
      subject,
      message,
    });

    res.status(201).json({
      message: "Thanks for Contacting us! You will hear back from us soon",
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const getPublicRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find({ status: { $ne: "blocked" } }).select(
      "restaurantName description coverImage cuisineTypes averageRating isOpen restaurantType city address servingHours"
    );
    res.status(200).json({ message: "Restaurants fetched successfully", data: restaurants });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const getPublicRestaurantDetail = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      const error = new Error("Restaurant not found");
      error.statusCode = 404;
      return next(error);
    }
    const menu = await Menu.findOne({ restaurantId });
    const menuItems = menu ? menu.menuItems.filter((i) => !i.isDeleted) : [];

    res.status(200).json({
      message: "Restaurant details fetched successfully",
      data: {
        restaurantId: restaurant,
        menuItems,
      },
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

