const express = require("express");
const router = express.Router();
const multer = require("multer");


const UserController = require("../contollers/UserController");
const deleteRecipesWithBase64Image = require("../middleware/deleteRecipeMiddleware");


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        return cb(null, "./public/images");
    },
    filename: function(req, file, cb){
        // Boşlukları kaldırmak için file.originalname'den boşlukları '-' ile değiştirelim
        const fileNameWithoutSpaces = file.originalname.replace(/\s+/g, '-');
        return cb(null, fileNameWithoutSpaces);
    }
});


const upload = multer({storage});

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/update-password", UserController.updatePassword);
router.post("/logout", UserController.logout);
    
router.post("/update_user", UserController.updateProfile);
router.post("/update_profile_image/:user_id", upload.single("image"), UserController.updateProfileImage);
router.get("/get_user_detail/:user_id", UserController.getUserDetail);
router.post("/post_user_interests", UserController.postInterests);

router.post("/get_recipe_by_userid", deleteRecipesWithBase64Image, UserController.getRecipeByUserId);

router.get("/user-search", UserController.userSearch);

router.get("/liked-recipes", UserController.getLikedRecipes);




module.exports = router;