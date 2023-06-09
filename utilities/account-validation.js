const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

const accountModel = require("../models/account-model")


/*  **********************************
 *  Unit 4: RPH - Login Data Validation Rules
 *  RPH: Here are the server-side messages that will be displayed
 * ********************************* */
validate.loginRules = () => {
  return [
    // password is required and must be strong password
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),

    // valid email is required and cannot already exist in the Datababse (DB)
    body("account_email")
    .trim()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs
    .withMessage("A valid email is required."),
  ]
}

/* ******************************
 * Check data and return errors or continue to login to next page
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      errors,
      title: "Login", 
      nav,
      account_email,
    })
    return
  }
  next()
}

/*  **********************************
 *  Registration Data Validation Rules
 *  RPH: Here are the server-side messages that will be displayed
 * ********************************* */
validate.registrationRules = () => { 
  return [
    // firstname is required and must be string // 
    body("account_firstname")
      .trim()
      .isString()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .isString()
      // .matches('^[a-zA-Z]+$')
      .matches('^[a-zA-Z]*$')
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // password is required and must be strong password
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),

    // valid email is required and cannot already exist in the database (DB)
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
       const emailExists = await accountModel.checkExistingEmail(account_email)
       if (emailExists){
        throw new Error("Email exists. Please log in or use different email")
       }
    }),
  ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

/* ******************************
 * Check editing format
 * ***************************** */
validate.editUserRules = (req, res) => { 
  return [
    // firstname is required and must be string // 
    body("account_firstname")
      .trim()
      .isString()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .isString()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.


    // valid email is required and cannot match another users in the database (DB)    
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email, {req}) => {
        const emailExistsCount = await accountModel.checkExistingEmail(account_email)

        if (emailExistsCount){       
          const oldFeatures = await accountModel.getAccountByID(req.body.account_id)

          if(oldFeatures.account_email!=account_email){
            throw new Error("Email exists. Please log in or use different email") 
          }
       }
    }),
  ]
}

/* ******************************
 * Check data and return errors or continue to edit
 * ***************************** */
validate.checkUserEditData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/update-View", {
      errors,
      title: "Edit Account5",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

/* ******************************
 * Check Password format
 * ***************************** */
validate.editPasswordRules = () => {
  return [
    // password is required and must be strong password
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkUserEditPasswordData = async (req, res, next) => {
  const { account_password } = req.body
  let errors = []
  errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("/update-View", {
      errors,
      title: "Registration12",
      nav,
      account_password,
    })
    return
  }
  next()
}

module.exports = validate
