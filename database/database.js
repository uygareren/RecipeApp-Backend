const mongoose = require('mongoose');
const MongoClient = mongodb.MongoClient;
require('dotenv').config();

export const _db = mongoose.connect(process.env.DB_URI, {useNewUrlParser:true, useUnifiedTopology:true})