const Category = require("../modal/Category");

exports.addCategory = async (req, res, next) => {
    const {categoryImage, categoryName } = req.body;

    if (!categoryName) {
        return res.status(400).json({ status: 400, success: false, message: "Category name can not be empty!" });
    }

    try {
        const newCategory = new Category({categoryImage, categoryName });
        const result = await newCategory.save();

        return res.status(200).json({ status: 200, success: true, message: "Category was saved successfully", data: result });
    } catch (error) {
        console.error("Add category error:", error);
        return res.status(500).json({ status: 500, success: false, message: "Internal Server Error" });
    }
}

exports.getAllCategory = async (req, res, next) => {

    const categories = Category.find({});
    
    try {
        const categories = await Category.find({});
        return res.status(200).json({ status: 200, success: true, message: "Successfully retrieved categories", data: categories });
    } catch (error) {
        console.error("Get all categories error:", error);
        return res.status(500).json({ status: 500, success: false, message: "Internal Server Error" });
    }
}
