const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Product = require("./product/Product")

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000", 
  methods: ["GET", "POST", "PUT", "DELETE"],//Specifies the HTTP methods that are allowed when accessing resources.
  credentials: true
}));

const port = 3002;// Server running Port Number

// Data base Connection 
mongoose.connect("mongodb://127.0.0.1:27017/Product")
.then(() => console.log("MongoDB connected"))// Connected Sucessfully
.catch((err) => console.error("MongoDB connection error:", err));// Conection error


// route to add a product
app.post('/add-product', async (req, res) => {
  try {
    const { name, category, price } = req.body;
    if (!name || !category || !price) {
      return res.status(400).send('All fields are required');
    }

    const newProduct = new Product({ name, category, price });
    await newProduct.save();
    res.status(201).send('Product added successfully!');// Data Save sucessfully in database
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).send('Error adding product');// Error message for not able to save the data
  }
});

// Route to update a product
app.put('/update-product/:id', async (req, res) => {
    try {
      const { id } = req.params;// Specific id of Updated data
      const { name, category, price } = req.body;
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { name, category, price },
        { new: true } // Return the updated document
      );
      if (!updatedProduct) {
        return res.status(404).send('Product not found');// Not Updated Error Message
      }
      res.status(200).send(updatedProduct);// Sucessfully updated 
    } catch (err) {
      console.error('Error updating product:', err);
      res.status(500).send('Error updating product');
    }
  });

// Route to get all products
app.get('/products', async (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (err) {
      console.error('Error retrieving products:', err);// Eroor Message for not able to fetch data from Database
      res.status(500).send('Error retrieving products');
    }
  });
// fetching a specific product from the database by its ID
  app.get('/product/:id', async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).send('Product not found');// Not able to find the Product
      }
      res.json(product);
    } catch (err) {
      console.error('Error fetching product:', err);// Not able to fetch the data from database
      res.status(500).send('Error fetching product');
    }
  });

 //To Delete the specific Product in data base
  app.delete('/product/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await Product.findByIdAndDelete(id);// find the product by id
      if (!result) {
        return res.status(404).send('Product not found');// Prduct not found Error message
      }
      res.status(200).send('Product deleted successfully!');// Product Deleted sucessfully
    } catch (err) {
      console.error('Error deleting product:', err);
      res.status(500).send('Error deleting product');// Not able to Delete Product
    }
  });
  

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
