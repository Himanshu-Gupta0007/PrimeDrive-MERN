const Car = require("../models/Car");

// ADD CAR (only owner / logged user)
const addCar = async (req, res) => {
  try {
    const {
      title,
      brand,
      pricePerDay,
      fuelType,
      transmission,
      city,
      image, // comes from ImageKit (filePath)
    } = req.body;

    // -------- VALIDATION --------
    if (!title || !brand || !pricePerDay || !fuelType || !transmission || !city) {
      return res.status(400).json({ message: "All fields required" });
    }

    // image required
    if (!image) {
      return res.status(400).json({ message: "Please upload car image" });
    }

    // allow only imagekit paths
    if (!image.startsWith("/cars/")) {
      return res.status(400).json({ message: "Invalid image path" });
    }

    // -------- CREATE CAR --------
    const car = await Car.create({
      owner: req.user._id, // from auth middleware
      title: title.trim(),
      brand: brand.trim(),
      pricePerDay: Number(pricePerDay),
      fuelType,
      transmission,
      city: city.trim(),
      image, // only filePath saved (BEST PRACTICE)
    });

    res.status(201).json({
      success: true,
      message: "Car added successfully 🚗",
      car,
    });

  } catch (error) {
    console.error("Add Car Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding car",
    });
  }
};

module.exports = { addCar };
