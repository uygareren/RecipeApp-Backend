const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

// routers
const adminRoutes = require("./routers/Auth");
const categoryRoutes = require("./routers/Category");
const recipeRoutes = require("./routers/Recipe");
const userEventRouter = require("./routers/UserEvents");


const app = express();
app.use(bodyParser.json());

const PORT = 3000;

mongoose.connect('mongodb+srv://123:123@recipeapp.neok85z.mongodb.net/');

app.use(adminRoutes);
app.use(categoryRoutes);
app.use(recipeRoutes);
app.use(userEventRouter);

// Adding a route handler for the root URL
app.get('/', (req, res) => {
    res.send('Hello, World!');
  });
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });