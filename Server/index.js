const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Product = require("./product/Product");

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

const port = 3002;

// Database Connection
mongoose.connect("mongodb://127.0.0.1:27017/Product")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Route to add a product
app.post('/add-product', async (req, res) => {
  try {
    const { name, category, price } = req.body;
    if (!name || !category || !price) {
      return res.status(400).send('All fields are required');
    }

    const newProduct = new Product({ name, category, price });
    await newProduct.save();
    res.status(201).send('Product added successfully!');
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).send('Error adding product');
  }
});

// Route to update a product
app.put('/update-product/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, category, price },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).send('Product not found');
    }
    res.status(200).send(updatedProduct);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).send('Error updating product');
  }
});

// Route to get all products with filtering and sorting
app.get('/products', async (req, res) => {
  try {
    const { name, category, priceOrder } = req.query;
    console.log('Query Params:', req.query);

    let query = {};

    // Filter by name
    if (name) {
      query.name = { $regex: name, $options: 'i' }; // Case-insensitive regex
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Execute the query
    let products = await Product.find(query);

    // Sort by price
    if (priceOrder === 'lowToHigh') {
      products = products.sort((a, b) => a.price - b.price);
    } else if (priceOrder === 'highToLow') {
      products = products.sort((a, b) => b.price - a.price);
    }

    console.log('Filtered Products:', products);

    res.status(200).json(products);
  } catch (err) {
    console.error('Error retrieving products:', err);
    res.status(500).send('Error retrieving products');
  }
});

// Route to get a specific product by ID
app.get('/product/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send('Product not found');
    }
    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).send('Error fetching product');
  }
});

// Route to delete a product
app.delete('/product/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Product.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).send('Product not found');
    }
    res.status(200).send('Product deleted successfully!');
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).send('Error deleting product');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
