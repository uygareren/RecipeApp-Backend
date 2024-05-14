const mongoose = require('mongoose');

const MadeMealsUser = new mongoose.Schema({
    userId: ({
        type: String,
        required: true
    }),
    recipes: [
        {
            recipeId:{
                type:String                
            },
            recipeName:{
                type:String,
            },
            recipeImage:{
                type:Buffer,
                default:null
            },
            status:{
                type:Number,
            }
        }
    ]

});

const MadeMealsByUser = mongoose.model("MadeMealsUser", MadeMealsUser);
module.exports = MadeMealsByUser;