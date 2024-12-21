import express from "express";

const router = express.Router();

router.get("/bookedFlights", async (req, res) => {
  const username = req.session?.user?.username;
  if (!username) {
    return res.status(401).json({ status: "error", message: "Unauthorized: Username is undefined" });
  }

  try {
    // Fetch bookings for the user
    const bookings = await req.models.Booking.find({ username });
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for this user" });
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;