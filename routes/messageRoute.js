const regValidate = require('../utilities/message-validation')

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
utilities.checkUserPermission,
utilities.handleErrors(messageController.buildMessageInbox))

router.post("/message/messageinbox", 
utilities.checkUserPermission,
utilities.handleErrors(messageController.markAsRead))

/***********************************
* Archive a message
* **********************************/
router.post("/message/archiveamessage/:message_id", 
utilities.checkUserPermission,
utilities.handleErrors(messageController.archiveCurrentMessage))


// // Route to inbox
// router.get('/inbox/:login_id', (req, res, next) => {
//   console.log("Entered /inbox/:login_id route");
//   next();
// }, Util.checkLogin, Util.handleErrors(messageController.buildInbox));

router.get("/message/newmessagepage", 
utilities.checkUserPermission,
utilities.handleErrors(messageController.buildNewMessagePage))

router.post(
  "/message/newmessagepage",
  utilities.checkUserPermission,
  // regValidate.newMessageRules(),
  // regValidate.checkMessageData,
  utilities.handleErrors(messageController.registerNewMessage)
)

/***********************************
* Reply to 1 existing message
* **********************************/
router.post(
  "/message/replybeingsent",
  utilities.checkUserPermission,
  utilities.handleErrors(messageController.registerNewMessageFromReply)
)


/***********************************
* View 1 message and its details
* **********************************/
router.get(
  "/message/messageinnerinfo/:message_id", 
  utilities.checkUserPermission,
  utilities.handleErrors(messageController.buildExistingMessagePage)
)

/***********************************
* Delete 1 message (and return to inbox)
* **********************************/
router.post(
  "/message/deletion/:message_id", 
  utilities.checkUserPermission,
  utilities.handleErrors(messageController.deleteCurrentMessagePage)
)

/***********************************
* Reply to 1 message (and return to inbox)
* **********************************/
router.post(
  "/message/reply/:message_id", 
  utilities.checkUserPermission,
  utilities.handleErrors(messageController.replyToCurrentMessage)
)

/***********************************
* Mark 1 message as read (and return to inbox)
* **********************************/
router.post(
  "/message/edit/:message_id",
  utilities.checkUserPermission,
  utilities.handleErrors(messageController.markAsRead22)
)

/***********************************
* archive 1 message (and return to inbox)
* **********************************/
router.get("/message/archive", 
  utilities.checkUserPermission,
  utilities.handleErrors(messageController.buildArchiveMessagePage)
)







/***********************************
* Open all archived messages/inbox
* **********************************/
router.get("/message/messagearchiveinbox", 
utilities.handleErrors(messageController.buildMessageArchiveInbox))

/***********************************
* View 1 archived message and its details
* **********************************/
router.get(
  "/message/messagearchiveinnerinfo/:message_id", 
  utilities.handleErrors(
    messageController.buildExistingArchiveMessagePage)
)

module.exports = router; 