
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
router.get(
  "/", 
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccount)
)

/*********************************
 * Unit 5: Edit User
 *********************************/
router.get(
  "/update-View",
  utilities.handleErrors(accountController.buildAccountEdit)
)

//Update
router.post(
  "/updated",
  regValidate.editUserRules(),
  regValidate.checkUserEditData,
  utilities.handleErrors(accountController.updateAccount)
)

//2nd update
router.post(
  "/updatedPassword",
  regValidate.editPasswordRules(),
  regValidate.checkUserEditPasswordData,
  utilities.handleErrors(accountController.updateAccountPassword)
)

/*********************************
 * Unit 5: Logout Activity
 *********************************/
router.get("/logout", utilities.handleErrors(accountController.buildLogout))

module.exports = router; 