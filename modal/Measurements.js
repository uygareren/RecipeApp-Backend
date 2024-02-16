const mongoose = require("mongoose");

const MeasurementsSchema = new mongoose.Schema({
    measurement_names: [{
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        type: { name: String }
    }]
});

const Measurement = mongoose.model("Measurement", MeasurementsSchema);

module.exports = Measurement;
