const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, password } = req.body;

    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res
        .status(400)
        .json({ ok: false, message: "Phone Number is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      phoneNumber,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({
      ok: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ ok: false, message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  // console.log(req.body, "this is body");
  try {
    const { phoneNumber, password } = req.body;

    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res
        .status(401)
        .json({ ok: false, message: "Invalid phone number or password" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res
        .status(401)
        .json({ ok: false, message: "Invalid phone number or password" });
    }

    const token = jwt.sign(
      { userId: user._id, phoneNumber: user.phoneNumber },
      "knolskape",
      { expiresIn: "6h" }
    );
    const userName = user.firstName;
    res
      .status(200)
      .json({ ok: true, message: "Login successful", token, userName });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ ok: false, message: "Internal server error" });
  }
});

router.post("/additem", async (req, res) => {
  try {
    const token = req.headers.authorization;

    const decodedTeken = jwt.verify(token, "knolskape");
    const userId = decodedTeken.userId;

    const user = await User.findById(userId);
    if (!user.cart.includes(req.body.id)) {
      user.cart.push(req.body.id);

      await user.save();
      res.status(200).json({
        ok: true,
        message: "Product added to cart",
        user: user,
      });
    } else {
      console.log("ID already present in the cart. Not adding again.");
      res.status(200).json({
        ok: false,
        message: "Product added to cart",
        user: user,
      });
    }
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ ok: false, message: "Internal server error" });
  }
});

router.get("/userDetails", async (req, res) => {
  // console.log(req.body, "this is body");
  try {
    const token = req.headers.authorization;
    const decodedTeken = jwt.verify(token, "knolskape");
    const userId = decodedTeken.userId;
    // console.log(userId, decodedTeken);
    const user = await User.findById(userId);
    res.status(200).json({
      ok: true,
      message: "User details",
      user: user,
    });
  } catch (error) {
    console.error("Error getting user details:", error);
    res.status(500).json({ ok: false, message: "Internal server error" });
  }
});

router.post("/removeitem", async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decodedTeken = jwt.verify(token, "knolskape");
    const userId = decodedTeken.userId;

    const user = await User.findById(userId);

    const idToRemove = req.body.productId;
    user.cart = user.cart.filter((item) => {
      console.log(item == idToRemove, "these");
      return item !== idToRemove;
    });
    console.log(user.cart, "this is final cart");
    await user.save();
    res.status(200).json({
      ok: true,
      message: "Product removed from cart",
      user: user,
    });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ ok: false, message: "Internal server error" });
  }
});

router.post("/placeorder", async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decodedTeken = jwt.verify(token, "knolskape");
    const userId = decodedTeken.userId;
    const user = await User.findById(userId);

    const cartItems = user.cart;

    user.orders.unshift(...cartItems);

    user.cart = [];

    await user.save();
    res.status(200).json({
      ok: true,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ ok: false, message: "Internal server error" });
  }
});

router.post("/emptyorders", async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decodedTeken = jwt.verify(token, "knolskape");
    const userId = decodedTeken.userId;
    const user = await User.findById(userId);
    user.orders = [];
    await user.save();
    res.status(200).json({
      ok: true,
      message: "Orders cleared successfully",
    });
  } catch (error) {
    console.error("Error clearing orders:", error);
    res.status(500).json({ ok: false, message: "Internal server error" });
  }
});
module.exports = router;
