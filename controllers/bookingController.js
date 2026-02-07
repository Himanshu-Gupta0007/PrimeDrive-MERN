const Booking = require("../models/booking");
const Car = require("../models/Car");


// ================= CREATE BOOKING =================
const createBooking = async (req, res) => {
  try {
    const { carId, startDate, endDate, pickupLocation, dropLocation } = req.body;

    if (!carId || !startDate || !endDate || !pickupLocation || !dropLocation) {
      return res.status(400).json({ message: "All fields required" });
    }

    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: "Car not found" });

    // ---- DATE VALIDATION ----
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({ message: "Invalid date range" });
    }

    // ---- CHECK CAR AVAILABILITY ----
    const existingBooking = await Booking.findOne({
      car: carId,
      status: { $in: ["pending", "confirmed"] },
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } },
      ],
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "Car already booked for selected dates",
      });
    }

    // ---- CALCULATE PRICE ----
    const diffTime = end - start;
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const totalPrice = totalDays * car.pricePerDay;

    // ---- CREATE BOOKING ----
    const booking = await Booking.create({
      user: req.user._id,
      owner: car.owner,
      car: car._id,
      startDate: start,
      endDate: end,
      totalDays,
      pricePerDay: car.pricePerDay,
      totalPrice,
      pickupLocation,
      dropLocation,
    });

    res.status(201).json({
      success: true,
      message: "Booking request sent",
      booking,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Booking failed" });
  }
};



// ================= USER BOOKINGS =================
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("car")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};



// ================= OWNER BOOKINGS =================
const getOwnerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ owner: req.user._id })
      .populate("car user")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch owner bookings" });
  }
};



// ================= UPDATE STATUS (OWNER) =================
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // only owner can change
    if (booking.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    booking.status = status;
    await booking.save();

    res.json({ success: true, message: "Booking updated", booking });

  } catch (error) {
    res.status(500).json({ message: "Status update failed" });
  }
};



// ================= CANCEL BOOKING (USER) =================
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ success: true, message: "Booking cancelled" });

  } catch (error) {
    res.status(500).json({ message: "Cancel failed" });
  }
};


module.exports = {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  updateBookingStatus,
  cancelBooking,
};
