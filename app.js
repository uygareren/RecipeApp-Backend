const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

// routers
const userRoutes = require("./routers/User");
const categoryRoutes = require("./routers/Category");
const recipeRoutes = require("./routers/Recipe");
const userEventRouter = require("./routers/UserEvents");
const followRouter = require("./routers/Follow");
const ingredientsRouter = require("./routers/Ingredients");
const worldCuisinesRouter = require("./routers/WorldCuisines");
const userInterestRouter = require("./routers/UserInterest");
const measurementsRouter = require("./routers/Measurements");


const app = express();
app.use(bodyParser.json());
app.use(express.static("public/images"));

const PORT = 3000;

mongoose.connect('mongodb+srv://123:123@recipeapp.neok85z.mongodb.net/');

app.use(userRoutes);
app.use(categoryRoutes);
app.use(recipeRoutes);
app.use(userEventRouter);
app.use(followRouter);
app.use(ingredientsRouter);
app.use(worldCuisinesRouter);
app.use(userInterestRouter);
app.use(measurementsRouter);

// Adding a route handler for the root URL
app.get('/', (req, res) => {
    res.send('Hello, World!');
  });
  
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});