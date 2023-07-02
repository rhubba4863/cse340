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
router.get("/message/messageinbox", 
utilities.handleErrors(messageController.buildMessageInbox))

// // Route to inbox
// router.get('/inbox/:login_id', (req, res, next) => {
//   console.log("Entered /inbox/:login_id route");
//   next();
// }, Util.checkLogin, Util.handleErrors(messageController.buildInbox));

router.get("/message/newmessagepage", 
utilities.handleErrors(messageController.buildNewMessagePage))

router.post(
  "/message/newmessagepage",
  utilities.handleErrors(messageController.registerNewMessage)
)

router.get(
  "/message/messageinnerinfo/:message_id", 
  utilities.handleErrors(messageController.buildExistingMessagePage)
)

// router.post(
//   "/delete",
//   utilities.checkUserPermission,
//   utilities.handleErrors(invController.deleteItem)
// )


// router.post(
//   "/message/delete/:message_id",
//   utilities.handleErrors(messageController.deleteMessage)
// )





router.post(
  "/delete2",
  utilities.handleErrors(messageController.deleteMessage)
)

// COMPARE THE "GET()" BELOW TO RUN FOR THE LATER POSTS
// router.get(
//   "/message/edit/:message_id", 
//   utilities.handleErrors(messageController.buildExistingMessagePage)
// )

router.post(
  "/message/edit",
  utilities.handleErrors(messageController.markAsRead)
)

router.get("/message/archive", 
utilities.handleErrors(messageController.buildArchiveMessagePage))

module.exports = router; 