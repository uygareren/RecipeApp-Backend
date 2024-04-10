const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    categoryImage: { type: String, default:null },
    categoryName: { type: String, required: true },
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
