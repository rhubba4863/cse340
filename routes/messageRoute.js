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
router.get("/messagesPage", 
utilities.handleErrors(messageController.buildMessageGroup))

router.get("/newMessage", 
utilities.handleErrors(messageController.buildNewMessagePage))

module.exports = router; 