const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({
    recipeName: {
        type: String,
        required: true
    },
    image: {
        type: Buffer,
        required: true
    },
    ingredients: [{ type: String }],
    recipeDescription: {
        type: String,
        required: true
    },
    categoryId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Recipe', RecipeSchema);
