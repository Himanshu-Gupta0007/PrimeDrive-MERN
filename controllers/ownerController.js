const Car = require("../models/Car");


// ================= ADD CAR =================
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

    // required fields
    if (!title || !brand || !pricePerDay || !fuelType || !transmission || !city) {
      return res.status(400).json({ message: "All fields required" });
    }

    // price validation
    if (isNaN(pricePerDay) || Number(pricePerDay) <= 0) {
      return res.status(400).json({ message: "Invalid price" });
    }

    // image validation
    if (!image) {
      return res.status(400).json({ message: "Please upload car image" });
    }

    if (!image.startsWith("/cars/")) {
      return res.status(400).json({ message: "Invalid image path" });
    }

    if (!/\.(jpg|jpeg|png|webp)$/i.test(image)) {
      return res.status(400).json({ message: "Invalid image format" });
    }

    const car = await Car.create({
      owner: req.user._id,
      title: title.trim(),
      brand: brand.trim(),
      pricePerDay: Number(pricePerDay),
      fuelType,
      transmission,
      city: city.trim(),
      image,
      isAvailable: true,
    });

    res.status(201).json({
      success: true,
      message: "Car added successfully",
      car,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Add car failed" });
  }
};



// ================= UPDATE CAR =================
const updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) return res.status(404).json({ message: "Car not found" });

    // owner check
    if (car.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // allowed fields only (IMPORTANT SECURITY)
    const allowedFields = [
      "title",
      "brand",
      "pricePerDay",
      "fuelType",
      "transmission",
      "city",
      "image",
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === "pricePerDay") {
          if (isNaN(req.body[field]) || Number(req.body[field]) <= 0) {
            return res.status(400).json({ message: "Invalid price" });
          }
          car[field] = Number(req.body[field]);
        } else if (field === "title" || field === "brand" || field === "city") {
          car[field] = req.body[field].trim();
        } else {
          car[field] = req.body[field];
        }
      }
    });

    await car.save();

    res.json({
      success: true,
      message: "Car updated successfully",
      car,
    });

  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};



// ================= DELETE CAR =================
const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) return res.status(404).json({ message: "Car not found" });

    if (car.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await car.deleteOne();

    res.json({
      success: true,
      message: "Car deleted successfully",
    });

  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};



// ================= TOGGLE AVAILABILITY =================
const toggleAvailability = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) return res.status(404).json({ message: "Car not found" });

    if (car.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    car.isAvailable = !car.isAvailable;
    await car.save();

    res.json({
      success: true,
      message: `Car is now ${car.isAvailable ? "Available" : "Unavailable"}`,
      car,
    });

  } catch (error) {
    res.status(500).json({ message: "Toggle failed" });
  }
};


module.exports = {
  addCar,
  updateCar,
  deleteCar,
  toggleAvailability,
};
