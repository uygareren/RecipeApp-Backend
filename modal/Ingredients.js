const mongoose = require("mongoose");

const IngredientsSchema = new mongoose.Schema({
    Ingredients_id: [
    {
      IngredientsName: { type: String, required: true },
      IngredientsData: [
        {
          _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
          type: { type: String }
        }
      ]
    }
  ]
});

const Ingredients = mongoose.model("Ingredients", IngredientsSchema);
module.exports = Ingredients;
