const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

//Return details for one car
//Note: req is a request, res is response of whats sent back
invCont.buildByModalId = async function (req, res, next) {
  // need inventoryID
  const inv_modal_id = req.params.id  
  const data = await invModel.getModalFeatures(inv_modal_id)
  const carDetails = await utilities.buildCarDetailView(data); 
  let nav = await utilities.getNav()

  res.render("./inventory/vehicle", {
    title: data.inv_year+" "+data.inv_make+" "+data.inv_model, 
    nav,
    carDetails,
  })
}

/******************************************************
* Reached by typing http://localhost:5500/inv 
* Call on the ejs shown (ex: aa/bb ejs is the bb, aa is folder bb is found in)
******************************************************/
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
  })
}

invCont.buildNewClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-Classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

invCont.buildNewVehicle = async function (req, res, next) {
  let nav = await utilities.getNav()
  let brands = await utilities.getClassTypes()
  res.render("inventory/add-Inventory", {
    title: "Add New Inventory",
    nav,
    brands,
    errors: null,
  })
}

/* ****************************************
*  Process Registration of new classification
* *************************************** */
invCont.registerClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { 
    classification_name
    //All peices transferred: first_name, last_name
  } = req.body

  //Where the data is sent to the modal
  const regResult = await invModel.registerClassification(
    classification_name
    //All peices transferred: first_name, last_name
  )

  if (regResult) {
    //RPH: Recall so new Car Brand Inserted
    nav = await  utilities.getNav()

    req.flash(
      "notice",
      `Congratulations, you\'ve registered ${classification_name}.`
    )
    res.status(201).render("inventory/management", {
      title: "Add New Classification",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the new classification creation failed.")
    res.status(501).render("inventory/add-Classification", {
      title: "Add New Classification",
      nav,
    })
  }
}

/* ****************************************
*  Process New car Registration
* *************************************** */
invCont.registerNewCar = async function (req, res) {
  let nav = await utilities.getNav()
  const { 
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    //All peices transferred: first_name, last_name...
  } = req.body

  //Where the data is sent to the modal
  const regResult = await invModel.registerIntoInventory(
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    //All peices transferred: first_name, last_name
  )

  if (regResult) {
    //RPH: Recall so new Car Inserted
    nav = await  utilities.getNav()

    req.flash(
      "notice",
      `Congratulations, you\'ve made a new ${inv_make}.`
    )
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the new car creation failed.")
    res.status(501).render("inventory/add-Inventory", {
      title: "Add New Inventory",
      nav,
    })
  }
}

module.exports = invCont