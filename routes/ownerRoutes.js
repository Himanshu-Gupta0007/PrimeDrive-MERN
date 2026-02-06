const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { addCar } = require("../controllers/ownerController");

// owner add car
router.post("/add-car", protect, addCar);

module.exports = router;
