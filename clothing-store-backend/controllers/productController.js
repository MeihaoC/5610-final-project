const Product = require("../models/Product");

exports.getAllProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, color, size } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (size) {
      filter.size = size;
    }

    const products = await Product.find(filter);
    res.send(products);
  } catch (error) {
    res.status(500).send("Error fetching products");
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("Product not found");
    res.send(product);
  } catch (error) {
    res.status(500).send("Error fetching product details");
  }
};

