const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    categoryImage: { type: String },
    categoryName: { type: String, required: true },
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
