const WorldCuisines = require('../modal/WorldCuisines');

exports.postWorldCuisines = async (req, res, next) => {
    const { world_cuisines_data } = req.body;

    try {
        if (!world_cuisines_data) {
            return res.status(400).json({ status: 400, success: false, message: "Error" });
        }

        const existing_world_cuisines = await WorldCuisines.findOne();

        if (existing_world_cuisines) {
            // Use push with spread operator to add items to the array
            existing_world_cuisines.cuisines_name.push(...world_cuisines_data.map(data => ({ type: data })));
            
            // Save the updated document
            await existing_world_cuisines.save();
        } else {
            // If document doesn't exist, create a new one
            const newWorldCuisines = new WorldCuisines({
                cuisines_name: world_cuisines_data.map(data => ({ type: data }))
            });
            await newWorldCuisines.save();
        }

        return res.status(200).json({ status: 200, success: true, message: "Saved Successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, success: false, message: "Internal Server Error" });
    }
}
exports.getAllWorldCuisines = async (req, res, next) => {

    try {
        const world_cuisines = await WorldCuisines.find();

        if(world_cuisines){
            return res.status(200).json({status:200, success: true, message:"Successfull!", data:world_cuisines})
        }else{
            return res.status(400).json({status:400, success: false, message:"No Data!"})
        }

    } catch (error) {
        return res.status(500).json({ status: 500, success: false, message: "Internal Server Error" });
    }

}
