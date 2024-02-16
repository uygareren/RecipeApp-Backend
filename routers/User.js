const express = require("express");
const router = express.Router();

const UserController = require("../contollers/UserController");

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/update-password", UserController.updatePassword);
router.post("/logout", UserController.logout);

router.post("/update_user", UserController.updateProfile);
router.get("/get_user_detail", UserController.getUserDetail);
router.post("/post_user_interests", UserController.postInterests);



module.exports = router;