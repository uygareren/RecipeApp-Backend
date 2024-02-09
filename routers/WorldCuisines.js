const express = require("express");
const router = express.Router();

const WorldCuisinesController = require("../contollers/WorldCuisinesController");

router.post("/post-world-couisines", WorldCuisinesController.postWorldCuisines);
router.get("/get-all-world-cuisines", WorldCuisinesController.getAllWorldCuisines);


module.exports = router;