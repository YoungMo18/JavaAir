import express from 'express';
import multer from 'multer';
import path from 'path';

import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const uploadDir = path.join(__dirname, '../../../../../uploads/');
const uploadDir = path.join(__dirname, '../../../../../uploads/');
// const uploadDir = path.join(__dirname, '../../../uploads/'); // Adjusted to the correct relative path

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

// Configure Multer File Filter
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type'), false);
  }
};

// Initialize Multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
});

// Upload Flight Images Route
router.post('/upload', upload.array('images', 10), (req, res) => {
  try {
    // Map the uploaded files to their URLs or paths
    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
    res.status(200).json({ message: 'Images uploaded successfully', imageUrls });
  } catch (error) {
    console.error('Error uploading images:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Other routes for flight-related functionality
router.post('/addFlight', async (req, res) => {
  const { flightID, from, to, departureTime, arrivalTime, departureDate, quantity, images } = req.body;

  try {
    // Check if the flight ID already exists
    const existingFlight = await req.models.Flight.findOne({ flightID });
    if (existingFlight) {
      return res.status(400).json({ message: 'Flight ID already exists' });
    }

    // Create a new flight entry
    const newFlight = new req.models.Flight({
      flightID,
      from,
      to,
      departureTime,
      arrivalTime,
      departureDate,
      quantity,
      images
    });

    await newFlight.save();
    res.status(201).json({ message: 'Flight added successfully', flight: newFlight });
  } catch (error) {
    console.error('Error adding flight:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get("/", async (req, res) => {
  try {
    const flights = await req.models.Flight.find();
    res.status(200).json(flights);
  } catch (error) {
    console.error("Error fetching flights:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:flightID", async (req, res) => {
  const { flightID } = req.params;
  try {
    const flight = await req.models.Flight.findOne({ flightID });
    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }
    res.status(200).json(flight);
  } catch (error) {
    console.error("Error fetching flight:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/bookings", async (req, res) => {
  const { flightID, from, to, departureTime, arrivalTime, departureDate } = req.body;

  try {
    const flight = await req.models.Flight.findOne({ flightID });
    if (!flight || flight.quantity <= 0) {
      return res.status(400).json({ message: "Flight not available" });
    }

    // Decrease flight quantity
    flight.quantity -= 1;
    await flight.save();

    // Save booking
    const booking = new req.models.Booking({
      flightID,
      from,
      to,
      departureTime,
      arrivalTime,
      departureDate,
    });

    await booking.save();

    res.status(201).json({ message: "Flight booked successfully" });
  } catch (error) {
    console.error("Error booking flight:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;