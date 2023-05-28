const utilities = require("../utilities/")

const errorCont = {}

/* ***************************
 *  Build inventory by classification view
 * Error Steps (Step 3)
 * ************************** */
errorCont.buildByError = async function (req, res, next) {
  const grid = await utilities.buildClassificationGrid(data)
  //CAUSES THE ERROR SINCE "nav" is missing
  // let nav = await utilities.getNav()
  const className = "Error Page";
  res.render("./inventory/classification", {
    title: className,
    nav,
    grid,
  })
}

module.exports = errorCont;