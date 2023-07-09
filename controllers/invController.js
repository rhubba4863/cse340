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
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
    classificationSelect,
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
  let brands = await utilities.buildClassificationList()
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

  const classificationSelect = await utilities.buildClassificationList()

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
      classificationSelect,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the new car creation failed.")
    res.status(501).render("inventory/add-Inventory", {
      title: "Add New Inventory",
      nav,
      classificationSelect,
      errors: null
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 *  Unit 5, Select Inv Item activity (Called from "client side" javascript)
 *    (return the JSON data.)
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build view to edit an inventory (a car) (Unit5)
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  
  //CARROT
  //const itemData = await invModel.getInventoryById(inv_id)
  const itemData = await invModel.getModalFeatures(inv_id)
    
  let brands = await utilities.buildClassificationList(itemData.classification_id)

  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-Inventory", {
    title: "Edit " + itemName,
    classificationSelect: classificationSelect,
    nav,
    brands,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ****************************************
*  Process car Registration
*  (Update a car, not add one)
* *************************************** */
invCont.updateInventory  = async function (req, res) {

    let nav = await utilities.getNav()
    const { 
      classification_id, inv_make,
      inv_model,         inv_description,
      inv_image,         inv_thumbnail,
      inv_price,         inv_year,
      inv_miles,         inv_color,
      inv_id,
      //All peices transferred: first_name, last_name...
    } = req.body

    //Where the data is sent to the modal
    const updateResult = await invModel.registerIntoInventory(
      classification_id, inv_make,
      inv_model,         inv_description,
      inv_image,         inv_thumbnail,
      inv_price,         inv_year,
      inv_miles,         inv_color,
      inv_id,
      //All peices transferred: first_name, last_name
    )

    if (updateResult) {
      req.flash(
        "notice",
        `Congratulations, the ${inv_make} ${inv_model} was successfully updated.`
      )
      res.redirect("/inv/")
    } else {
      const classificationSelect = await utilities.buildClassificationList(classification_id)
      const itemName = `${inv_make} ${inv_model}`
      req.flash("notice", "Sorry, the insert failed.")
      res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
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
      inv_id,
    })
  }
}

/* ***************************
 *  Build delete confirmation view
 * Unit 5, Delete Activity (1)
 * ************************** */
invCont.deleteView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getModalFeatures(inv_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-Confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}

/* ***************************
 *  Build delete confirmation view
 * Unit 5, Delete Activity (2)
 * ************************** */
invCont.deleteItem = async function (req, res, next) {
  const inv_id = parseInt(req.body.inv_id)
  let nav = await utilities.getNav()

  const deleteResult = await invModel.deleteInventoryItem(inv_id)
  
  if(deleteResult){
    req.flash("notice", 'The deletion was successful.')
    res.redirect('/inv/')
  } else {
    req.flash("notice", 'Sorry, the delete failed.')
    res.redirect('/inv/delete/inv_id')
  }
}


module.exports = invCont