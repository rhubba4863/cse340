const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
//Carrot
const invModel = require("../models/inventory-model")
const accModel = require("../models/account-model.js")
const mesCont = require("../controllers/messageController")


/*  **********************************
 *  Inventory Data Validation Rules
 *  RPH: Here are the (Backend) server-side messages that will be displayed
 * ********************************* */
validate.newMessageRules = () => { 
  return [
    body("message_to")
    .trim()
    .isNumeric()
    .custom(async value => {
      // Get users 
      console.log("DOGGGS 0 "+"Hear")
      const usersResult = await accModel.getUsers();
      const accounts = usersResult.rows;
      const myUsers = await mesCont.buildTheUserList()

      console.log("DOG EAT DOG "+JSON.stringify(accounts))

      console.log("DOGGGS 1 "+"Hear")
      //JSON.stringify(req.body)
      //req.params
      console.log("DOGGGS 2 "+"Hear")
      // Check if the submitted value exists in the user array
      if (!accounts.find(c => c.account_id == value)) {
        console.log("DOGGGS 3 X"+value+"X")


        throw new Error('Invalid Account ID');
      }
      return true;
    })
    .withMessage("Valid Account ID must be entered."),

    // Make is required and must be string
    body("message_subject")
      .trim()
      .isString()
      .isLength({ min: 1 })
      .withMessage("Please provide a subject."), // on error this message is sent.
    
    // Color is required and must be string
    body("message_body")
      .trim()
      .isString()
      .isLength({ min: 1 })
      .withMessage("Please provide a description."), // on error this message is sent.
  ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkMessageData = async (req, res, next) => {
  const { 
    message_id,
    message_subject,
    message_body,
    message_created,
    message_to,
    message_from,
    message_read,
    message_archived,
    //All peices transferred: first_name, last_name...
  } = req.body
  
  console.log("OCEAN - x"+message_body+"x")


  let errors = []
  errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let brands = await utilities.buildClassificationList()
    const myUsers = await utilities.buildTheUserList()
    res.render("message/newmessagepage", {
      errors,
      title: "PARKER: New Message", //Keep same title
      nav,
      brands, //If fails include the brands to show eror
      myUsers,
      message_id,
      message_subject,
      message_body,
      message_created,
      message_to,
      message_from,
      message_read,
      message_archived,
    })
    return
  }
  next()
}

module.exports = validate