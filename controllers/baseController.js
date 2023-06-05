//lvl 2: list of vehicles page

const utilities = require("../utilities/")
const baseController = {} //creates an empty object named baseController.

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  req.flash("notice", "This is a flash message.") //Unit 4
  res.render("index", {title: "Home", nav})
}

// error link - Simpler
baseController.errorFunc = async function(req, res){
  // const nav = await utilities.getNav()
  req.flash("notice", "This is a flash message.") //Unit 4
  res.render("index", {title: "Home", nav})
}

module.exports = baseController