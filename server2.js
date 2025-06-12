import express from 'express';
import { logger } from './middleware/logger.js';
import auth from './middleware/auth.js';
import jwt from 'jsonwebtoken';
import validate from './middleware/validate.js';

const app = express();
const PORT = process.env.PORT;

// middleware
app.use(express.json());
app.use(logger);

// Resources
const products = [
  {
    id: 1,
    name: "Galaxy T-shirt",
    description: "Comfortable cotton shirt with a galaxy print.",
    price: 19.99,
    category: "Clothing",
    inStock: true
  },
  {
    id: 2,
    name: "Rocket Mug",
    description: "Ceramic coffee mug with a rocket ship design.",
    price: 12.5,
    category: "Kitchen",
    inStock: true
  },
  {
    id: 3,
    name: "Astronaut Backpack",
    description: "Durable backpack with cool astronaut graphics.",
    price: 39.99,
    category: "Accessories",
    inStock: false
  },
  {
    id: 4,
    name: "Moon Lamp",
    description: "3D printed moon night light with adjustable brightness.",
    price: 24.99,
    category: "Home Decor",
    inStock: true
  },
  {
    id: 5,
    name: "Star Map Poster",
    description: "Glow-in-the-dark poster of the constellations.",
    price: 15.0,
    category: "Wall Art",
    inStock: true
  }
];

app.get('/', (req, res) => {
  res.json('Hello World');
});

// call api for auth token
app.get('/api/auth', (req, res) => {
  try {
    const token = jwt.sign('register', 'secrat#');
    res.json({success: true, token})
  } catch (error) {
    res.json({success: false, message: error.message});
  }
});


// all products
app.get('/api/products', (req, res) => {
  try {
    res.json({success: true, products});
  } catch (error) {
    res.json({success: false, message: error.message});
  }
});

// specific product with id
app.get('/api/products/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const product = products.find((item) => item.id === id);
    if(!product) {
      return res.json({success: false, message: 'product not found'});
    }
    res.json({success: true, product});
  } catch (error) {
    res.json({success: false, message: error.message});
  }
});

// add product
app.post('/api/products', validate, auth, (req, res) => {
  try {
    const { id, name, description, price, category, inStock } = req.body;

    products.push(
      {
        id, name, description, price, category, inStock
      });

    res.json({success: true, message: `product ${name} added successfully`});
  } catch (error) {
    res.json({success: false, message: error.message});
  }
});

// update product
app.put('/api/products/:id', auth, (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, description, price, category, inStock } = req.body;
    const product = products.find((item) => item.id === id);
    if(!product) {
      return res.json({success: false, message: 'product not found'});
    }

    // update
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (name !== price) product.price = price;
    if (name !== category) product.category = category;
    if (name !== undefined) product.inStock = inStock;

    res.json({success: true, message: `product id ${product.id} updated successfully.`});
  } catch (error) {
    res.json({success: false, message: error.message});
  }
});

// delete product
app.delete('/api/products/:id', auth, (req, res) => {
  try {
    const id = Number(req.params.id);
    const index = products.findIndex((item) => item.id === id);
    if(index === -1) {
      return res.json({success: false, message: 'product not found'});
    }
    products.splice(index, 1);
    res.json({success: true, message: 'deleted successfully'});
  } catch (error) {
    res.json({success: false, message: error.message});
  }
});

// query params
app.get('/api/products/search', (req, res) => {
  const { category, inStock } = req.query;

  let filtered = products;

  if (category) {
    filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (inStock) {
    const isInStock = inStock === 'true'; // Because query params come as strings
    filtered = filtered.filter(p => p.inStock === isInStock);
  }

  res.json({ success: true, results: filtered });
});



app.listen(PORT, () => {
  console.log('Server running on port 3000');
});