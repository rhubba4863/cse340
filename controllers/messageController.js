const utilities = require("../utilities/") //RPH 4
const accountModel = require("../models/account-model.js")

/* ****************************************
*  Message Level PARKERH
* *************************************** */
/* ****************************************
*  Deliver login view
* *************************************** */
async function messageInbox(req, res, next) {
  let nav = await utilities.getNav()

  // console.log("FOUND "+ accountData.account_id)
  let messageTable = await utilities.buildMessageList()
  // console.log("GOING "+ nav.account_id)
  // console.log("GOING "+ nav.account_id)
  //  console.log("GOING "+ nav.account_id)
  res.render("./message/messageinbox", {
    title: "Inbox",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver new message view
* *************************************** */
async function buildNewMessagePage(req, res, next) {
  let nav = await utilities.getNav()
  const myUsers = await utilities.buildUserList()
  // const myMessages = await utilities.buildMessageList()
  //const myUsers = await utilities.buildClassificationList()

  res.render("message/new-Message-Page", {
    title: "New Message",
    nav,
    errors: null,
    myUsers,
  })
}

//Export for use
module.exports = {  messageInbox, buildNewMessagePage}