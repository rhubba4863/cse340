// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/") //RPH 4

const regValidate = require('../utilities/account-validation')


// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(
  invController.buildByClassificationId));
//Show details of 1 car
router.get("/detail/:id", utilities.handleErrors(
  invController.buildByModalId)); //RPH Unit 3

//Unit 4: Show "Inventory Management" page  
//With "/" simply listening for "inv" shown in "server.js" http://localhost:5500/inv
router.get("/", utilities.handleErrors(
  invController.buildManagement)); //RPH Unit 4 

/* ******************************
 * Deliver Classification View
 * ***************************** */
router.get("/add-Classification", 
  utilities.handleErrors(invController.buildNewClassification))

  //Unit4-Part2
// Process the classification data
router.post(
  "/add-Classification",
  regValidate.registerClassRules(),
  regValidate.checkClassData,
  utilities.handleErrors(invController.registerClassification)
)

/* ******************************
 * Deliver Inventory View
 * ***************************** */
router.get("/add-Inventory", utilities.handleErrors(
  invController.buildNewVehicle)); //RPH Unit 4 

router.post(
  "/add-Inventory",
  // regValidate.registerClassRules(),
  // regValidate.checkClassData,
  utilities.handleErrors(invController.registerNewCar)
)

  // router.get("/",  (req, res) => {
  //   res.status(200).send('Series of unfortunate events')
  // }); //RPH Unit 3

module.exports = router; 