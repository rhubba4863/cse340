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

//req is a request, res is response of whats sent back

//Return details for one car
invCont.buildByModalId = async function (req, res, next) {
  // need inventoryID
  const inv_modal_id = req.params.id  
  console.log("RPH11:"+inv_modal_id);
  const data = await invModel.getModalFeatures(inv_modal_id)
  console.log("RPH22:"+data);
  const carDetails = await utilities.buildCarDetailView(data); 
  let nav = await utilities.getNav()

  res.render("./inventory/vehicle", {
    title: data.inv_year+" "+data.inv_make+" "+data.inv_model, 
    nav,
    carDetails,
  })
}

module.exports = invCont