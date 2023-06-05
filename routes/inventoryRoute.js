// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/") //RPH 4


// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(
  invController.buildByClassificationId));
router.get("/detail/:id", utilities.handleErrors(
  invController.buildByModalId)); //RPH Unit 3


module.exports = router; 