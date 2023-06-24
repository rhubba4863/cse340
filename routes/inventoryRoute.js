// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/") //RPH 4

const regValidate = require('../utilities/inventory-validation')


// Route to build inventory by classification view
router.get("/type/:classificationId", 
  utilities.handleErrors(
  invController.buildByClassificationId));
//Show details of 1 car
router.get("/detail/:id", utilities.handleErrors(
  invController.buildByModalId)); //RPH Unit 3

//Unit 4: Show "Inventory Management" page  
//With "/" simply listening for "inv" shown in "server.js" http://localhost:5500/inv
router.get("/", 
  utilities.checkUserPermission,
  utilities.handleErrors(
  invController.buildManagement)); //RPH Unit 4 

/* ******************************
 * Deliver Classification View
 * ***************************** */
router.get("/add-Classification", 
  utilities.checkUserPermission,
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
router.get("/add-Inventory", 
  utilities.checkUserPermission,
  utilities.handleErrors(invController.buildNewVehicle)); //RPH Unit 4 

router.post(
  "/add-Inventory",
  utilities.checkUserPermission,
  regValidate.inventoryRegisterRules(),
  regValidate.checkInventoryData,
  utilities.handleErrors(invController.registerNewCar)
)

/* ******************************
 * Unit 5 - Deliver 
 * ***************************** */
// /inv/getInventory/:classification_id
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON))

/* ******************************
 * Step 1 - Trigger Update process
 * Unit 5 - Update Inventory Information
 * ***************************** */
router.get("/edit/:inv_id", 
  utilities.checkUserPermission,
  utilities.handleErrors(invController.editInventoryView)
)

/* ******************************
 * Step 2 - Check Data
 * Unit 5 - Update Inventory Information 
 * ***************************** */
//CARROT
router.post("/update/", 
  regValidate.inventoryRegisterRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

/* ******************************
 * Employee, admin get access (Step 2)
 * ***************************** */

/* ******************************
 * Deliver the delete confirmation view
 * Unit 5, Delete Activity (1)
 * ***************************** */
router.get(
  "/delete/:inv_id",
  utilities.checkUserPermission,
  utilities.handleErrors(invController.deleteView)
)

/* ******************************
 * Process the delete inventory request
 * Unit 5, Delete Activity (2)
 * ***************************** */
router.post(
  "/delete",
  utilities.checkUserPermission,
  utilities.handleErrors(invController.deleteItem)
)



  // router.get("/",  (req, res) => {
  //   res.status(200).send('Series of unfortunate events')
  // }); //RPH Unit 3

module.exports = router; 