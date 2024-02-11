const express = require("express");
const router = express.Router();

const UserInterestControllers = require("../contollers/UserInterestController");

router.post("/add_user_interest", UserInterestControllers.postUserInterest);
router.get("/get_user_interest/:user_id", UserInterestControllers.getUserInterest);
router.post("/update_user_interest", UserInterestControllers.updateUserInterest);

module.exports = router;