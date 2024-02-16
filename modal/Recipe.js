const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema(
  {
    recipeName: {
      type: String,
      required: true,
    },
    image: {
      type: Buffer,
      required: true,
    },
    ingredients: [{ type: String }],
    ingredients_with_measurements: [
      {ingredients_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      measurement_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      measurement: {
        type: String,
        required: true,
      },}
    ],
    worldCuisinesTagId:{
      type: String,
    },
    recipeDescription: {
      type: String,
      required: true,
    },
    categoryId: {
      type: String,
      required: true,
    },
    calory:{
      type:String,
      required:true
    },
    level:{
      type:String,
      required:true
    },
    cooking_time:{
      type: String,
      required: true
    }
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Recipe", RecipeSchema);
