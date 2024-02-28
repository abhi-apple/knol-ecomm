const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config(); // Load environment variables

const app = express();

app.use(express.json());

app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 4242;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(bodyParser.json());
app.use(cors());

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    // Start the server only after successful MongoDB connection
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.get("/login", (req, res) => {
  res.render("login");
});

const userRoutes = require("./routes/users");
const productRoutes = require("./routes/products");

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
