const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  updateBookingStatus,
  cancelBooking,
} = require("../controllers/bookingController");


// ================= USER ROUTES =================

// create booking
router.post("/create", protect, createBooking);

// user bookings
router.get("/my-bookings", protect, getMyBookings);

// cancel booking
router.patch("/cancel/:id", protect, cancelBooking);


// ================= OWNER ROUTES =================

// owner received bookings
router.get("/owner-bookings", protect, getOwnerBookings);

// owner approve/reject booking
router.patch("/status/:id", protect, updateBookingStatus);


module.exports = router;
