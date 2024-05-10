const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema(
  {
    recipeName: {
      type: String,
      required: true,
    },
    image: {
      type: String,
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
    userId: {
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
    },
    user:{
      userId:{
        type:String
      },
      name:{
        type:String
      },
      surname:{
        type:String
      },
      image:{
        type:String
      }
    }
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Recipe", RecipeSchema);
