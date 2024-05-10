const Recipe = require('../modal/Recipe'); // Senin Recipe modelini import et

const deleteRecipesWithBase64Image = async (req, res, next) => {
  try {
    const recipes = await Recipe.find();

    // Her bir recipe'yi kontrol et
    for (const recipe of recipes) {
      if (recipe.image === 'Base64_encoded_image_data') {
        await Recipe.findByIdAndDelete(recipe._id);
      }
    }
    
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = deleteRecipesWithBase64Image;
