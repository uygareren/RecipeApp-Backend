const express = require("express");
const router = express.Router();

const CategoryController = require("../contollers/CategoryController");

router.post("/add-category", CategoryController.addCategory);
router.get("/categories", CategoryController.getAllCategory);

module.exports = router;