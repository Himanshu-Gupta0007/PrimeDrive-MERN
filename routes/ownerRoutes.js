const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  addCar,
  updateCar,
  deleteCar,
  toggleAvailability,
} = require("../controllers/ownerController");


// ===== OWNER CAR MANAGEMENT =====

// add car
router.post("/add-car", protect, addCar);

// update car
router.put("/update-car/:id", protect, updateCar);

// delete car
router.delete("/delete-car/:id", protect, deleteCar);

// toggle availability (available/unavailable)
router.patch("/toggle-car/:id", protect, toggleAvailability);

module.exports = router;
