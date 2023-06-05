
/***********************************
* Account routes
* Unit 4, deliver login view activity
* **********************************/
//bring the account-validation page, 
//from the utilities folder into the routes scope
const regValidate = require('../utilities/account-validation')

// Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")

/***********************************
* Deliver Login View
* Unit 4, deliver login view activity 
* **********************************/
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Process the login attempt     
//regValidate.checkLoginData(),
//utilities.handleErrors(accountController.registerAccount)

router.post(
  "/login",
  regValidate.loginRules(),
  // regValidate.checkLoginData(),
  // utilities.handleErrors(accountController.loginAccount),
  (req, res) => {
    res.status(200).send('login process')
  }
)

/***********************************
* Deliver Registration View
* Unit 4, deliver registration view activity
* **********************************/
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

module.exports = router; 