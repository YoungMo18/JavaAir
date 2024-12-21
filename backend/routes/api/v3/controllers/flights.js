import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Directory to store uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PNG, JPEG, and JPG are allowed."));
    }
  },
});

// POST route for uploading images
router.post("/upload", upload.array("images", 10), (req, res) => {
  try {
    const imageUrls = req.files.map((file) =>
      path.join("/uploads", file.filename)
    );
    res.status(200).json({ imageUrls });
  } catch (error) {
    console.error("Image upload failed:", error);
    res.status(500).json({ message: "Image upload failed" });
  }
});

// POST route to create a flight
router.post("/", async (req, res) => {
  const {
    flightID,
    from,
    to,
    departureTime,
    arrivalTime,
    departureDate,
    quantity,
    images,
  } = req.body;

  if (
    !flightID ||
    !from ||
    !to ||
    !departureTime ||
    !arrivalTime ||
    !departureDate ||
    !quantity ||
    !images
  ) {
    return res.status(400).json({ message: "Missing fields in request body" });
  }

  try {
    // Check if flight already exists
    const existingFlight = await req.models.Flight.findOne({ flightID });
    if (existingFlight) {
      return res.status(400).json({ message: "Flight ID already exists" });
    }

    const newFlight = new req.models.Flight({
      flightID,
      from,
      to,
      departureTime,
      arrivalTime,
      departureDate,
      quantity,
      images,
    });

    await newFlight.save();
    res.status(201).json({ message: "Flight created successfully" });
  } catch (error) {
    console.error("Error creating flight:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;