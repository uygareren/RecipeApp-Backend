const mongoose = require('mongoose');

const MadeMealsRecipe = new mongoose.Schema({
    recipeId: ({
        type: String,
        required: true
    }),
    user: [
        {
            userId:{
                type:String                
            },
            userName:{
                type:String,
            },
            userImage:{
                type:Buffer,
                default:null
            },
            status:{
                type:Number,
            }
        }
    ]

});

const MadeMealsByRecipe = mongoose.model("MadeMealsRecipe", MadeMealsRecipe);
module.exports = MadeMealsByRecipe;
