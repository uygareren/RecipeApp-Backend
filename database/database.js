const mongoose = require('mongoose');
const MongoClient = mongodb.MongoClient;
require('dotenv').config();

export const _db = mongoose.connect('mongodb+srv://recipeapp:123@recipeapp.neok85z.mongodb.net/', {useNewUrlParser:true, useUnifiedTopology:true})