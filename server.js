const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

dotenv.config();
connectDB();

const app = express();

// ================= MIDDLEWARE =================

// ⭐ VERY IMPORTANT FOR COOKIES
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL (Vite)
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// ================= ROUTES =================
app.get("/", (req, res) => {
  res.send("PrimeDrive API Running 🚗");
});

app.use("/api/auth", authRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/bookings", bookingRoutes);

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
