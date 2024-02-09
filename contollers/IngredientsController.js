const Ingredients = require('../modal/Ingredients');

exports.saveIngredients = async (req, res) => {
    const { ingredients_name, ingredients_data } = req.body;

    try {
      // Find the document (assuming you already have one)
      const existingIngredients = await Ingredients.findOne();

      // If the document exists, add a new category
      if (existingIngredients) {
        existingIngredients.Ingredients_id.push({
          IngredientsName: ingredients_name,
          IngredientsData: ingredients_data.map(data => ({ type: data }))
        });

        // Save the updated document
        const savedIngredients = await existingIngredients.save();

        return res.status(200).json({ status: 200, success: true, message: "Saved Successfully!", data: savedIngredients });
      } else {
        // If the document doesn't exist, create a new one
        const newIngredients = new Ingredients({
          Ingredients_id: [
            {
              IngredientsName: ingredients_name,
              IngredientsData: ingredients_data.map(data => ({ type: data }))
            }
          ]
        });

        // Save the new document
        const savedIngredients = await newIngredients.save();

        return res.status(200).json({ status: 200, success: true, message: "Saved Successfully!", data: savedIngredients });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getAllIngredients = async (req, res, next) => {

    try {
        const  data = await Ingredients.find();
        return res.status(200).json({status:200, success: true, message: "Successfull!", data:data})
    } catch (error) {
        return res.status(500).json({ status: 500, success: false, message: "Internal Server Error" });
    }
}
