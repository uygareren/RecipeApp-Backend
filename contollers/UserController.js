const User = require("../modal/User");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require('jsonwebtoken');
const { trace } = require("../routers/User");
const Recipe = require("../modal/Recipe");
const Like = require("../modal/Like");
const multer = require("multer");
const Comment = require('../modal/Comment');
const MadeMealsByUser = require('../modal/MadeMealsUser');
const MadeMealsByRecipe = require('../modal/MadeMealsRecipe');
require('dotenv').config();




exports.register = async (req, res, next) => {
    const { name, surname, email, password_1, password_2 } = req.body;

    if (password_1 !== password_2) {
        return res.status(400).json({ success: false, message_en: "Passwords do not Match!", message_tr: "Parolalar Eşleşmiyor!" });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ success: false, message_en: "Invalid Email Format", message_tr: "Geçersiz Email!" });
    }

    try {
        // Wait for the query to finish and get the result
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ success: false, message_en: "Email is Already Registered!", message_tr:"Email Zaten Kayıtlı!"});
        }

        const hashedPassword = await bcrypt.hash(password_1, 10);

        const user = new User({
            name,
            surname,
            email,
            password: hashedPassword
        });

        const result = await user.save();
        return res.status(200).json({ status: 200, success: true, data: { name, surname, email } });

    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ status: 500, success: false, message: "Internal Server Error" });
    }
};


exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Kullanıcının e-posta adresine göre veritabanında arama yap
        const user = await User.findOne({email:email});

        // Kullanıcı bulunamazsa
        if (!user) {
            return res.status(401).json({ success: false, message_en: "Invalid email or password", message_tr: "Email veya Parola Hatalı!" });
        }

        // Şifreyi kontrol et
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ success: false, message_en: "Invalid password", message_tr: "Geçersiz Parola!" });
        }

        // Giriş başarılı ise token oluştur ve kullanıcı bilgilerini döndür
        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: '30d' });

        return res.status(200).json({
            status: 200,
            success: true,
            data: { userId: user._id, name: user.name, surname: user.surname, email: user.email, token: token },
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ status: 500, success: false, message: "Internal Server Error" });
    }
};


exports.updatePassword = async (req, res, next) => {
    const { userId, currentPassword, newPassword1, newPassword2 } = req.body;

    
    if (!newPassword1 || !newPassword2 || newPassword1 !== newPassword2) {
        return res.status(400).json({ status: 400, success: false, message: "New passwords do not match" });
    }

    try {
        // Kullanıcının ID'sine göre veritabanında arama yap
        const user = await User.findById(userId);

        // Kullanıcı bulunamazsa
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Mevcut şifreyi kontrol et
        const passwordMatch = await bcrypt.compare(currentPassword, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: "Current password is incorrect" });
        }

        // Yeni şifreyi hashle
        const hashedNewPassword1 = await bcrypt.hash(newPassword1, 10);

        // Şifreyi güncelle
        user.password = hashedNewPassword1;
        await user.save();

        return res.status(200).json({ status: 200, success: true, message: "Password updated successfully" });
    } catch (error) {
        console.error("Update password error:", error);
        return res.status(500).json({ status: 500, success: false, message: "Internal Server Error" });
    }
};


exports.logout = (req, res) => {
    
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized - No token provided" });
    }

    try {
        // Token'ı doğrula ve geçersiz kılma işlemleri
        jwt.verify(token, 'your_secret_key');
        // Token'ı geçersiz kılma veya sıfırlama işlemleri

        // Başarıyla çıkış yapıldığını belirt
        res.status(200).json({ success: true, message: "Logout successful" });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(401).json({ success: false, message: "Unauthorized - Invalid token" });
    }
};


exports.updateProfile = async (req, res, next) => {
    const {user_id, name, surname, email,phone, country, city, biography} = req.body;

    if(!user_id || !name || !surname || !email || !phone || !country || !city || !biography){
        return res.status(400).json({status: 400, success:false, message: "Error"})
    }

    try {
        const user = await User.findById(user_id);

        user.name = name;
        user.surname = surname;
        user.email = email;
        user.phone = phone;
        user.country = country;
        user.city = city;
        user.biography = biography;
        
        await user.save();

        return res.status(200).json({status:200, success:true, message:"Succesfull", data:user});

    } catch (error) {
        return res.status(500).json({ success: false, message: "Error" });
    }

}


exports.updateProfileImage = async (req, res, next) => {
    const { user_id } = req.params;
    const image = req.file.filename; // Assuming Multer middleware handles file upload

    try {
        // Find the user by user_id
        const user = await User.findById(user_id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // // Convert the base64 string to a Buffer
        // const imageBuffer = Buffer.from(image, 'base64');

        // // Update the image field with the new image data
        user.image = image;

        // Save the updated user document
        await user.save();

        res.status(200).json({ message: "Profile image successfully updated.", data:image, success:true });
    } catch (error) {
        console.error("Error updating profile image:", error);
        res.status(500).json({ message: "An error occurred, profile image could not be updated." });
    }
};


exports.getUserDetail = async (req, res, next) => {
    const {user_id} = req.params;

    if(!user_id){
        return res.status(400).json({status: 400, success:false, message: "Error"})
    }

    try {
        const user = await User.findById(user_id);
        if(user){
            return res.status(200).json({
                status: 200,
                success: true,
                message: "Successful",
                user: {
                  ...user.toObject(), // Convert to plain object
                  userId: user._id, // Rename _id to userId
                },
              });
        }else{
            return res.status(400).json({status: 400, success:false, message: "No any user!"})
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error" });
    }
}


exports.postInterests = async (req, res, next) => {

    const {user_id, interests_data} = req.body;

    if(!interests_data || !user_id){
        return res.status(400).json({status: 400, success:false, message: "Interests Data and User id is required!"})
    }

    try {

        const user = await User.findById(user_id);

        user.interests = interests_data;

        await user.save();

        return res.status(200).json({status: 200, success:true, message: "Successfull!"})
        
    } catch (error) {
        return res.status(500).json({status:500, success: false, message: "Error" });
    }

}

exports.getRecipeByUserId = async (req,res,next) => {
    const {user_id} = req.body;

    if(!user_id){
        return res.status(400).json({status: 400, success:false, message: "User id is required!"})
    }

    try {
        const data = await Recipe.find({userId:user_id});
        return res.status(200).json({status: 200, success:true, message: "Successfull!", data:data});

    } catch (error) {
        return res.status(500).json({status:500, success: false, message: "Error" });
        
    }

}

exports.userSearch = async(req,res,next) => {
    const {userQuery} =  req.query;

    const regex = new RegExp(userQuery, 'i');

    const user = await User.find({ name: regex });

    const userData = user.map(user => ({
        id:user._id,
        name: user.name,
        surname: user.surname,
        image:user.image
    }));

    res.status(200).json({ success: true, data: userData });


}


exports.getLikedRecipes = async (req, res, next) => {
    const { user_id } = req.query; 

    try {
        const likes = await Like.find({ userId: user_id }).select('recipeId');

        const recipeIds = likes.map(like => like.recipeId);

        const recipes = await Recipe.find({ _id: { $in: recipeIds } });

        return res.status(200).json({ success: true, data: recipes });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

exports.getMadeMealsByUser = async (req, res, next) => {
    const {userId} = req.params;
    
    try {
        if(!userId){
            return res.status(400).json({ success: false, message_en: "User Id is required!", message_tr: "User Id Gerekli!" });
        }

        const meals = await MadeMealsByUser.find({userId:userId});
        
        return res.status(200).json({ success: true, data: meals });

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
        
    }
    
}

exports.postMadeMealsByUser = async (req, res, next) => {
    const { userId, userName, userSurname, userImage, recipeId, recipeName, recipeImage, status } = req.body;

    try {
        if (!userId) {
            return res.status(400).json({ success: false, message_en: "User Id is required!", message_tr: "User Id Gerekli!" });
        }

        let madeMealsUser = await MadeMealsByUser.findOne({ userId: userId });
        let madeMealsRecipe = await MadeMealsByRecipe.findOne({ recipeId: recipeId });
        

        if (!madeMealsUser) {
            // If no record exists for the user, create a new one
            madeMealsUser = new MadeMealsByUser({
                userId: userId,
                recipes: []
            });
        }
        if (!madeMealsRecipe) {
            // If no record exists for the user, create a new one
            madeMealsRecipe = new MadeMealsByRecipe({
                recipeId: recipeId,
                user: []
            });
        }

        // Check if the recipe already exists for the user
        const existingRecipe = madeMealsUser.recipes.find(recipe => recipe.recipeId === recipeId);

        if (existingRecipe) {
            return res.status(400).json({ success: false, message_en: "Recipe already exists for this user!", message_tr: "Bu kullanıcı için tarif zaten mevcut!" });
        }

        // Add the new recipe to the user's made meals
        madeMealsUser.recipes.push({
            recipeId: recipeId,
            recipeName: recipeName,
            recipeImage: recipeImage,
            status: status
        });

        madeMealsRecipe.user.push({
            userId:userId,
            userName:userName,
            userImage:userImage,
            status:status
        })

        // Save the changes to the database
        await madeMealsUser.save();
        await madeMealsRecipe.save();

        return res.status(200).json({ success: true, message_en: "Recipe added successfully!", message_tr: "Tarif başarıyla eklendi!" });
        
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

exports.postDoneMeals = async (req, res, next) => {
    const { userId, recipeId, status } = req.body;

    try {
        if (!userId) {
            return res.status(400).json({ success: false, message_en: "User Id is required!", message_tr: "User Id Gerekli!" });
        }
        if (!recipeId) {
            return res.status(400).json({ success: false, message_en: "Recipe Id is required!", message_tr: "Recipe Id Gerekli!" });
        }

        let mealInUser = await MadeMealsByUser.findOne({ userId: userId });
        let mealByRecipe = await MadeMealsByRecipe.findOne({ recipeId: recipeId });

        if (!mealInUser) {
            return res.status(400).json({ success: false, message_en: "There are no recipes for this user!", message_tr: "Bu kullanıcı için herhangi bir tarif bulunamadı!" });
        }

        if (!mealByRecipe) {
            return res.status(400).json({ success: false, message_en: "There are no users for this recipe!", message_tr: "Bu tarife ait herhangi bir kullanıcı bulunamadı!" });
        }

            const userRecipe = await mealInUser.recipes.filter((recipe) => recipe.recipeId == recipeId);
            userRecipe[0].status = status;
            mealInUser.recipes = userRecipe;

            const recipeUser = await mealByRecipe.user.filter((user) => user.userId == userId);
            recipeUser[0].status = status;
            mealByRecipe.user = recipeUser;

            // // Save the changes
            await mealInUser.save();
            await mealByRecipe.save();

            return res.status(200).json({ success: true, message_en: "Status changed!", message_tr: "Durum Değiştirildi!" });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}


exports.deleteRecipeMadeMealsByUser = async (req, res, next) => {
    const { userId, recipeId } = req.body;

    try {
        if (!userId) {
            return res.status(400).json({ success: false, message_en: "User Id is required!", message_tr: "User Id Gerekli!" });
        }

        let meals = await MadeMealsByUser.findOne({ userId: userId });
        let userInMeals = await MadeMealsByRecipe.findOne({recipeId: recipeId});

        if (!meals || !meals.recipes || meals.recipes.length === 0) {
            return res.status(400).json({ success: false, message_en: "There are no recipes for this user!", message_tr: "Bu kullanıcı için herhangi bir tarif bulunamadı!" });
        }

        // Filter out the recipe with the given recipeId
        meals.recipes = meals.recipes.filter((meal) => meal.recipeId !== recipeId);
        userInMeals.user = userInMeals.user.filter((user) => user.userId != userId);

        await meals.save();
        await userInMeals.save();

        return res.status(200).json({ success: true, message_en: "Recipe deleted successfully!", message_tr: "Tarif başarıyla silindi!" });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}




