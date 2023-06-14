
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
* Modified in Unit 5, Login Process activity
* **********************************/
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Process the login attempt     
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  // utilities.handleErrors(accountController.loginAccount),
  utilities.handleErrors(accountController.accountLogin),
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

/*********************************
 * Unit 5: Login Activity
 *********************************/
router.get("/", utilities.handleErrors(accountController.buildAccount))

// Process the registration data
// router.post(
//   "/",
//   utilities.handleErrors(accountController.buildAccount)
//   // regValidate.registrationRules(),
//   // regValidate.checkRegData,
//   // utilities.handleErrors(accountController.registerAccount)

  //RPH: For now simply go to blank page
  // (req, res) => {
  //   res.status(200).send('You are logged in')
  // }
//)


  //RPH: For now simply go to blank page
  // (req, res) => {
  //   res.status(200).send('login process')
  // }

module.exports = router; 