const Measurements = require('../modal/Measurements');


exports.postMeasurements = async (req, res, next) => {

    const {measurement_data} = req.body;

    console.log("measuremen_data", measurement_data);
    
   try {
    if(!measurement_data){
        return res.status(400).json({ status: 400, success: false, message: "Error" });
    }

    const existing_measurements = await Measurements.findOne();

    if(existing_measurements){
        existing_measurements.measurement_names.push(...measurement_data.map(data => ({ name: data })));
        await existing_measurements.save();
    }else{
        const newMeasurements = await new Measurements({
            measurement_names : measurement_data.map(data => ({ name: data }))
        })
        await newMeasurements.save();
    }
    return res.status(200).json({ status: 200, success: true, message: "Saved Successfully" });
    
   } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, success: false, message: "Internal Server Error" });
   }
}

exports.getMeasurements = async (req, res, next) => {

    try {
        const measurements_data = await Measurements.find();
        return res.status(200).json({
            status:200,
            success:true,
            message:"successfull!",
            measurements_data
        })
    } catch (error) {
        return res.status(500).json({ status: 500, success: false, message: "Internal Server Error" });
    }

}