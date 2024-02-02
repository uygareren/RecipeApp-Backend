const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

// routers
const adminRoutes = require("./routers/Auth");


const app = express();
app.use(bodyParser.json());

const PORT = 3000;

mongoose.connect('mongodb+srv://123:123@recipeapp.neok85z.mongodb.net/');

app.use(adminRoutes);

// Adding a route handler for the root URL
app.get('/', (req, res) => {
    res.send('Hello, World!');
  });
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });