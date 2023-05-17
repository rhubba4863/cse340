const utilities = require("../utilities/")
const baseController = {} //creates an empty object named baseController.

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
}

module.exports = baseController