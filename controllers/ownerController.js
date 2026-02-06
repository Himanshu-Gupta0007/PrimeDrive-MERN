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
      image,
    } = req.body;

    if (!title || !brand || !pricePerDay || !fuelType || !transmission || !city) {
      return res.status(400).json({ message: "All fields required" });
    }

    const car = await Car.create({
      owner: req.user._id, // from auth middleware
      title,
      brand,
      pricePerDay,
      fuelType,
      transmission,
      city,
      image,
    });

    res.status(201).json({
      message: "Car added successfully",
      car,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addCar };
