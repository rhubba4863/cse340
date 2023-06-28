const regValidate = require('../utilities/account-validation')

// Needed Resources
const express = require("express")
const router = new express.Router()
const messageController = require("../controllers/messageController")
const utilities = require("../utilities")

/*********************************
 * Unit 6: Message Activity
 *********************************/
/***********************************
* Deliver Message View
* Final Project
* **********************************/
router.get("/messageinbox", 
utilities.handleErrors(messageController.messageInbox))

// // Route to inbox
// router.get('/inbox/:login_id', (req, res, next) => {
//   console.log("Entered /inbox/:login_id route");
//   next();
// }, Util.checkLogin, Util.handleErrors(messageController.buildInbox));

router.get("/newMessage", 
utilities.handleErrors(messageController.buildNewMessagePage))

module.exports = router; 