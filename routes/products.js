const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, price, category, images, rating } = req.body;

    const newProduct = new Product({
      title,
      description,
      price,
      category,
      images,
      rating,
    });

    await newProduct.save();

    res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json({ product });
  } catch (error) {
    console.error("Error getting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/filter", async (req, res) => {
  try {
    const { category, rating, filter } = req.body;

    const query = {};
    if (category) {
      query.category = category;
    }
    if (rating) {
      let minRating;
      switch (rating) {
        case "Above 4.5 rating":
          minRating = 4.5;
          break;
        case "Above 4 rating":
          minRating = 4;
          break;
        case "Above 3.5 rating":
          minRating = 3.5;
          break;
        default:
          minRating = 0;
      }
      query.rating = { $gte: minRating };
    }

    let sort = {};
    switch (filter) {
      case "Price high to low":
        sort.price = -1;
        break;
      case "Price low to high":
        sort.price = 1;
        break;
      case "Average customer ratings":
        sort.rating = -1;
        break;
      default:
        sort = { createdAt: -1 };
    }

    const products = await Product.find(query).sort(sort);

    res.status(200).json({ products });
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// router.post("/search", async (req, res) => {
//   const searchQuery = req.body?.query?.toLowerCase();

//   try {
//     if (searchQuery) {
//       const searchResults = await Product.find({
//         $or: [
//           { title: { $regex: searchQuery, $options: "i" } },
//           { description: { $regex: searchQuery, $options: "i" } },
//         ],
//       });
//       console.log(searchResults, "from back");
//       res.json(searchResults);
//     } else {
//       res.json([]);
//     }
//   } catch (err) {
//     console.error("Error searching products:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

module.exports = router;
