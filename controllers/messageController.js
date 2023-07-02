const utilities = require("../utilities/") //RPH 4
const accountModel = require("../models/account-model.js")
const mesModel = require("../models/message-model")

const mesCont = {}

/* ****************************************
*  Message Level PARKERH
* *************************************** */
/* ****************************************
*  Main Message Page
* *************************************** */
mesCont.buildMessageInbox = async function (req, res, next) {
  let nav = await utilities.getNav()
  console.log("1) Building the inbox")
  const accountData = await accountModel.getAccountByID(res.locals.accountData.account_id)
  let messageTable = "";
  //let messageTable = await utilities.buildMessageList;
  console.log("2A) Building the inbox")

  try{
    console.log("2) Building the inbox")
    let data = await mesModel.getMessagesForUser(accountData)

    messageTable += '<tbody>'; 
    messageTable += '<table class="myMessages">'; 
    messageTable += '<thead>';
    messageTable += '<tr><th>Received</th><th>Subject</th><th>From</th><th>Read</th></tr>'; 
    messageTable += '</thead>';
     
    // for (let index = 0; index < fruitsToGet.length; index++) {
    // // Get num of each fruit
    // }
    //https://www.freecodecamp.org/news/javascript-async-and-await-in-loops-30ecc5fb3939/  
    for (let index = 0; index < data.rows.length; index++) {
      let oneMessage = data.rows[index]
      let bday = oneMessage.message_created;
      let date = await utilities.getDateFrom(bday).then()
      let anAccount = await accountModel.getAccountByID(oneMessage.message_from)
      let name = anAccount.account_firstname + " "+ anAccount.account_lastname


      //Create the row
      messageTable += '<tr>'
      messageTable += '<td>'+ date+ '</td>' 
      messageTable += '<td><a href="/message/messageinnerinfo/'+oneMessage.message_id+ '"title="View Message">' 
        + oneMessage.message_subject + '</a></td>'
      messageTable += '<td>' + name + '</td>'
      messageTable += '<td>' + oneMessage.message_read + '</td>'
      messageTable += '</tr>'
    }

    messageTable += '</table>'; 
    messageTable += '</tbody>'; 
  } catch(err){
    console.log("3) Building the unarchived buildMessageInbox() failed")
  }
  
  res.render("./message/messageinbox", {
    title: "Inbox",
    nav,
    errors: null,
    messageTable,
  })
}

mesCont.buildTheUserList = async function(req, res, next){
  const accModel = require("../models/account-model.js")
  let data = await accModel.getUsers()
  let classifications = '<select name="message_to" id="accountList">'
  classifications +=  '<option value="none" selected disabled hidden>Select a recipient</option>'
  data.rows.forEach(user => {
    classifications += '<option value="' + user.account_id + '">' + user.account_firstname 
    + " " + user.account_lastname + "</option>"
  }) 
  classifications += '</select>'
  return classifications
}

/* ****************************************
*  Deliver new message view
* *************************************** */
mesCont.buildNewMessagePage = async function (req, res, next) {
  let nav = await utilities.getNav()
  const myUsers = await mesCont.buildTheUserList()
  //console.log("MAGIC3 "+res.locals.accountData.account_id)

  res.render("./message/newmessagepage", {
    title: "New Message",
    nav,
    errors: null,
    myUsers, 
  })
}

/* ****************************************
*  Deliver 1 message view
* *************************************** */
mesCont.buildArchiveMessagePage = async function (req, res, next) {
  let nav = await utilities.getNav()
  const myUsers = await mesCont.buildTheUserList()
  let messageTable = await utilities.buildMessageList()

  // const myMessages = await utilities.buildMessageList()
  //const myUsers = await utilities.buildClassificationList()

  res.render("message/archive", {
    title: "PARKER-Archive",
    nav,
    errors: null,
    myUsers,
    messageTable,
  })
}

/* ****************************************
*  Deliver 1 message view
* *************************************** */
mesCont.buildExistingMessagePage = async function (req, res, next) {
  let nav = await utilities.getNav()
  const myUsers = await mesCont.buildTheUserList()
  const accountData = await accountModel.getAccountByID(res.locals.accountData.account_id)
  console.log("1)")
  const mess_id = req.params.message_id
  console.log("1A)"+mess_id)

  const messageData = await mesModel.getMessageFeatures(mess_id);
  console.log("2)")

  let anAccount = await accountModel.getAccountByID(messageData.message_from)
  let name2 = await mesCont.getFullNameFromId(messageData.message_from)
  console.log("3)")
  //res.locals.oneMessage
  // const myUsers = await utilities.buildUserList()
  // const myMessages = await utilities.buildMessageList()
  //const myUsers = await utilities.buildClassificationList()

  console.log("HHHH1"+"GG")
  console.log("HHHH2"+"GG")
  console.log("HHHH3"+JSON.stringify(req.body)+"GG")
  console.log("HHHH4"+req.body.message_id+"GG")
  console.log("HHHH5"+req.body.inv_id+"GG")
  console.log("HHHH6"+ await mesCont.getFullNameFromId(messageData.message_from)+"")
  console.log("HHHH7"+await mesCont.getFullNameFromId(messageData.message_to)+"")


  res.render("message/messageinfo", {
    title: accountData.account_firstname +" " + accountData.account_lastname,
    nav,
    errors: null,
    myUsers,
    messageData,
    name2
  })
}

mesCont.registerNewMessage = async function (req, res) {
  let nav = await utilities.getNav()
  let { 
    message_subject, message_body, 
    message_created, message_to, 
    message_from,    message_read, 
    message_archived,
    //All peices transferred: ...
  } = req.body

  //console.log("MAGIC8 "+res.locals.accountData.account_firstname) 
  message_from = res.locals.accountData.account_id  

  //Where the data is sent to the modal
  const mesResult = await mesModel.registerIntoMessages(
    message_subject, message_body, 
    message_created, message_to, 
    message_from,    message_read, 
    message_archived,
    //All peices transferred: ...
  )

  const messageTable = await utilities.buildClassificationList()

  //if (!mesResult) to test the else statement
  if (mesResult) {
    //RPH: Recall so new message Inserted
    nav = await  utilities.getNav()


    req.flash(
      "notice",
      `Congratulations, message has been sent.`
    )
        
    // console.groupCollapsed("HUBBARD - success registerNewMessage")

    // //Use exact file path
    //  res.status(201).render("message/messageinbox", {
    //     title: "Inventory Management",
    //     nav,
    //     messageTable,
    //     errors: null,
    //   })
     res.redirect("/message/messageinbox")
    
  } else {
    console.groupCollapsed("HUBBARD - failed registerNewMessage")
    req.flash("notice", "Sorry, the new message creation failed.")
    res.status(501).render("/message/newmessagepage", {
      title: "Add New Inventory",
      nav,
      classificationSelect,
      errors: null
    })
  }
}

/* ***************************
 *  Delete opened row
 * ************************** */
mesCont.deleteMessage = async function (req, res, next) {
  //const inv_id = parseInt(req.body.inv_id)
  let nav = await utilities.getNav()

  console.log("DOGGY1 ")

  const mess_id = req.params.message_id 

  console.log("DOGGY2 "+ mess_id)
  console.log("DOGGY3 "+ mess_id)
  console.log("DOGGY4 "+ mess_id)

//   const deleteResult = await invModel.deleteInventoryItem(inv_id)
  
//   if(deleteResult){
//     req.flash("notice", 'The deletion was successful.')
     res.redirect('/inv/')
//   } else {
//     req.flash("notice", 'Sorry, the delete failed.')
//     res.redirect('/inv/delete/inv_id')
//   }
}

/* ***************************
 *  Mark as read
 * ************************** */
mesCont.markAsRead = async function (req, res, next) {
  console.log("STONE1 ")

  const mess_id = req.params.message_id 
  JSON.stringify(req.body)

  console.log("STONE2 "+ mess_id)
  console.log("HHHH4"+req.body.message_id+"GG")
  console.log("HHHH5"+req.body.inv_id+"GG")
}

mesCont.buildUserList = async function(req, res, next){
  const accModel = require("../models/account-model.js")
  let data = await accModel.getUsers()
  let classifications = '<select name="message_to" id="accountList">'
  classifications +=  '<option value="none" selected disabled hidden>Select a recipient</option>'
  data.rows.forEach(user => {
    classifications += '<option value="' + user.account_id + '">' + user.account_firstname 
    + " " + user.account_lastname + "</option>"
  }) 
  classifications += '</select>'
  return classifications
}

mesCont.getFullNameFromId = async function(id){
  let anAccount = await accountModel.getAccountByID(id)
  let name = anAccount.account_firstname + " "+ anAccount.account_lastname
  return name;
}

//Export for use
// module.exports = {  buildMessageInbox, buildNewMessagePage, buildExistingMessagePage, 
//   buildArchiveMessagePage}

module.exports = mesCont