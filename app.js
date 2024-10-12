// file import
const router = require("./src/routes/api");

// basic
const bodyParser = require("body-parser");
const express = require("express");
const app = express();

// security middleware
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const xssClean = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

// database library import
const mongoose = require("mongoose");

// security middleware implement
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(xssClean());
app.use(hpp());

// body parser implement
app.use(bodyParser.json());

// request rate limit
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 3000 });
app.use(limiter);

// MongoDB connection
const URL = "mongodb+srv://salman:Todo1234@cluster0.3tkg5.mongodb.net/Todo"; // Change 'todo' to 'Todo'
const connectDB = async () => {
  try {
    await mongoose.connect(URL);
    console.log("Connection Success");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
};

// Call the connection function
connectDB();

// routing implement
app.use("/api/v1", router);

// undefined route implement
app.use("*", (req, res) => {
  res.status(404).json({ status: "fail", data: "Not Found" });
});

module.exports = app;
