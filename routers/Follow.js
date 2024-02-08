const express = require("express");

const router = express.Router();

const followController = require("../contollers/FollowController");

router.post("/add_followed", followController.addFollowed);
router.get("/get_followed", followController.getAllFollowed);
router.post("/remove_followed/:followed_id", followController.removeFollowed);

router.post("/add_follower", followController.addFollower);
router.get("/get_follower", followController.getAllFollower);
router.post("/remove_follower/:follower_id", followController.removeFollower);


module.exports = router;