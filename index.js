// index.js

const express = require("express");
const mongoose = require("mongoose");

const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(express.json());

app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 4242;

app.use(bodyParser.json());
app.use(cors());

mongoose
  .connect(
    "mongodb+srv://abhinay:Abhi1890@ecomknol.lhbp5z0.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to MongoDB");
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
