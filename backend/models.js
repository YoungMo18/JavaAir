import mongoose from "mongoose";

let models = {};

console.log("Connecting to MongoDB...");

await mongoose.connect(
  "mongodb+srv://info441_user:info441_user@cluster0.pajam.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);

console.log("Successfully connected to MongoDB!");

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, required: true },
});

models.User = mongoose.model("User", userSchema);

// Flight Schema
const flightSchema = new mongoose.Schema({
  flightID: { type: String, required: true, unique: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  departureDate: { type: String, required: true },
  quantity: { type: Number, required: true },
  images: { type: [String], required: true },
});

models.Flight = mongoose.model("Flight", flightSchema);

console.log("Mongoose models created!");

export default models;