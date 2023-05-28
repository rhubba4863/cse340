
// Error Steps (Step 2)

const express = require("express")
const router = new express.Router() 
const errorController = require("../controllers/errorController")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/buildError", utilities.handleErrors(errorController.buildByError));

module.exports = router; 