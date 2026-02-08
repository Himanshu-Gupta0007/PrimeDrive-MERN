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

    if (!title || !brand || !pricePerDay || !fuelType || !transmission || !city) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (!image) {
      return res.status(400).json({ message: "Please upload car image" });
    }

    if (!image.startsWith("/cars/")) {
      return res.status(400).json({ message: "Invalid image path" });
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

    res.status(201).json({ success: true, message: "Car added", car });

  } catch (error) {
    res.status(500).json({ success: false, message: "Add car failed" });
  }
};


// ================= UPDATE CAR =================
const updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) return res.status(404).json({ message: "Car not found" });

    // only owner can edit
    if (car.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updated = await Car.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );





    res.json({ success: true, message: "Car updated", car: updated });

  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};












//kjkjkjuioohh
// ================= DELETE CAR =================
const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) return res.status(404).json({ message: "Car not found" });

    if (car.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await car.deleteOne();

    res.json({ success: true, message: "Car deleted" });

  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};






















//kjjjij

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
