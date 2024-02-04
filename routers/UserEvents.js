const express = require("express");
const router = express.Router();


const UserEventControllers = require("../contollers/UserEventsController");

router.post("/post_like", UserEventControllers.postLike);
router.post("/post_comment", UserEventControllers.postComment);
router.get("/get_comments/:recipe_id", UserEventControllers.getComments);
router.post("/delete_comment", UserEventControllers.deleteComment);

module.exports = router;