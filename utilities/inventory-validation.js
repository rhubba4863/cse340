const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Classification Data Validation Rules
 *  RPH: Here are the server-side messages that will be displayed
 * ********************************* */
validate.registerClassRules = () => { 
  return [
    // lastname is required and must be string
    body("classification_name")
      .trim()
      .isString()
      .isLength({ min: 2 })
      .withMessage("Please provide a classification."), // on error this message is sent.
  ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-Classification", {
      errors,
      title: "Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

/*  **********************************
 *  Inventory Data Validation Rules
 *  RPH: Here are the (Backend) server-side messages that will be displayed
 * ********************************* */
validate.inventoryRegisterRules = () => { 
  return [
    // classification is required and must be string
    body("classification_id")
      .trim()
      .isString()
      .isLength({ min: 2 })
      .withMessage("Please provide a classification."), // on error this message is sent.

    // Make is required and must be string
    body("inv_make")
      .trim()
      .isString()
      .isLength({ min: 3 })
      .withMessage("Please provide a make."), // on error this message is sent.
    
    // Model is required and must be string
    body("inv_model")
      .trim()
      .isString()
      .isLength({ min: 3 })
      .withMessage("Please provide a model."), // on error this message is sent.

    // Description is required and must be string
    body("inv_description")
      .trim()
      .isString()
       .isLength({ min: 1 })
      .withMessage("Please provide a description."), // on error this message is sent.

    // Image is required and must be string
    body("inv_image")
      .trim()
      .isString()
       .isLength({ min: 1 })
      .withMessage("Please provide an image."), // on error this message is sent.
    
    // Thumbnail is required and must be string
    body("inv_thumbnail")
      .trim()
      .isString()
      .isLength({ min: 1 })
      .withMessage("Please provide a thumbnail."), // on error this message is sent.

    // Price is required and must be a number
    body("inv_price")
      .trim()      
      .toInt()
      .isInt({ min: 0})
      .withMessage("Please provide a price."), // on error this message is sent.
    
    // Year is required and must be a number
    body("inv_year") 
      .trim()
      .toInt()
      .isInt({min: 1900})
      .withMessage("Please provide a year."), // on error this message is sent.

    // Miles is required and must be a number
    body("inv_miles")
      .trim()
      .isNumeric()
      .isInt({min: 0})
      .withMessage("Please provide miles."), // on error this message is sent.
    
    // Color is required and must be string
    body("inv_color")
      .trim()
      .isString()
      .isLength({ min: 1 })
      .withMessage("Please provide a color."), // on error this message is sent.
  ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
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
  
  let errors = []
  errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let brands = await utilities.getClassTypes()
    res.render("inventory/add-Inventory", {
      errors,
      title: "Add New Inventory", //Keep same title
      nav,
      brands, //If fails include the brands to show eror
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
    })
    return
  }
  next()
}

module.exports = validate
