const express = require('express');
const router = express.Router();

const MeasurementsController = require('../contollers/MeasurementController');

router.post("/post_measurements", MeasurementsController.postMeasurements);
router.get("/get_measurements", MeasurementsController.getMeasurements);

module.exports = router;