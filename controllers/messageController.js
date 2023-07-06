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
  let messageTasking = ''
  //let messageTable = await utilities.buildMessageList;
  console.log("2A) Building the inbox")

  try{
    console.log("2) Building the inbox")
    let data = await mesModel.getMessagesForUser(accountData)

    let archive= (await mesModel.getArchiveMessagesForUserByID(accountData.account_id)).rows.length

    messageTasking += '<ul><li><a href="/message/newmessagepage" title="Message Inbox">Create a New Message</a></li>'
    messageTasking +='<li><a href="/message/messagearchiveinbox" title="Archived Messages">View '+archive
    +' Archived Message(s)</a></li></ul>'

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
    messageTasking,
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

  console.log("BENBEN")
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
/* ****************************************
*  Main Message Page
* *************************************** */
mesCont.buildMessageArchiveInbox = async function (req, res, next) {
  let nav = await utilities.getNav()
  console.log("1) Building the inbox")
  const accountData = await accountModel.getAccountByID(res.locals.accountData.account_id)
  let messageTable = "";
  //let messageTable = await utilities.buildMessageList;
  console.log("2A) Building the inbox")

  try{
    console.log("2) Building the inbox")
    let data = await mesModel.getArchiveMessagesForUser(accountData)

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
      messageTable += '<td><a href="/message/messagearchiveinnerinfo/'+oneMessage.message_id+ '"title="View Message">' 
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

    
  res.render("./message/archive", {
    title: "Inbox",
    nav,
    errors: null,
    messageTable,
  })
}

/* ****************************************
*  Deliver 1 normal message view
* *************************************** */
mesCont.buildExistingMessagePage = async function (req, res, next) {
  let nav = await utilities.getNav()
  const myUsers = await mesCont.buildTheUserList()
  const accountData = await accountModel.getAccountByID(res.locals.accountData.account_id)
  const mess_id = req.params.message_id
  const messageData = await mesModel.getMessageFeatures(mess_id);

  let anAccount = await accountModel.getAccountByID(messageData.message_from)
  let name2 = await mesCont.getFullNameFromId(messageData.message_from)

  let linktable = '<a href="/message/messageinbox" title="inbox">Return to Inbox</a><br>';
  linktable += "<form action='/message/reply/"+mess_id+"' method='post'>";
  linktable += ' <button type="submit"title="Click to reply to user">Reply</button>';
  linktable += '</form>';
  
  linktable += "<form action='/message/edit/"+mess_id+"' method='post'>";
  linktable += ' <button type="submit"title="Click to mark message read">Mark as Read</button>';
  linktable += '</form>';
  
  linktable += "<form action='/message/archiveamessage/"+mess_id+"' method='post'>";
  linktable += ' <button type="submit"title="Archive this message">Archive Message</button>';
  linktable += '</form>';

  linktable += "<form action='/message/deletion/"+mess_id+"' method='post'>";
  linktable += ' <button type="submit"title="Click to delete">Delete Message</button>';
  linktable += '</form>';

  res.render("message/messageinfo", {
    title: accountData.account_firstname +" " + accountData.account_lastname,
    nav,
    errors: null,
    myUsers,
    messageData,
    name2,
    linktable
  })
}

mesCont.registerNewMessage = async function (req, res, next) {
  console.log("BEN HUR1")
  let nav = await utilities.getNav()
  let { 
    message_subject, message_body, 
    message_created, message_to, 
    message_from,    message_read, 
    message_archived,
    //All peices transferred: ...
  } = req.body

  console.log("1PARK1 "+ message_subject)
  console.log("1PARK2 "+ message_body)
  console.log("1PARK3 "+ message_created)
  console.log("1PARK4 "+ message_to)
  console.log("1PARK5 "+ message_from)
  console.log("1PARK6 "+ message_read)
  console.log("1PARK7 "+ message_archived)

  console.log("BEN HUR2")
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
        
    // //Use exact file path
    //  res.status(201).render("message/messageinbox", {
    //     title: "Inventory Management",
    //     nav,
    //     messageTable,
    //     errors: null,
    //   })
     res.redirect("/message/messageinbox")
    
  } else {
    req.flash("notice", "Sorry, the new message creation failed.")
    res.status(501).render("/message/newmessagepage", {
      title: "Add New Inventory",
      nav,
      classificationSelect,
      errors: null
    })
  }
}

mesCont.registerNewMessageFromReply = async function (req, res, next) {
  console.log("JURASSIC PARK1")
  let nav = await utilities.getNav()
  let { 
    message_subject, message_body, 
    message_created, message_to, 
    message_from,    message_read, 
    message_archived,
    //All peices transferred: ...
  } = req.body

  console.log("JURASSIC PARK2")
  JSON.stringify(req.body)

  console.log("PARK1 "+ message_subject)
  console.log("PARK2 "+ message_body)
  console.log("PARK3 "+ message_created)
  console.log("PARK4 "+ message_to)
  console.log("PARK5 "+ message_from)
  console.log("PARK6 "+ message_read)
  console.log("PARK7 "+ message_archived)


  //console.log("MAGIC8 "+res.locals.accountData.account_firstname) 
  message_from = res.locals.accountData.account_id  

  // //Where the data is sent to the modal
  // const mesResult = await mesModel.registerIntoMessages(
  //   message_subject, message_body, 
  //   message_created, message_to, 
  //   message_from,    message_read, 
  //   message_archived,
  //   //All peices transferred: ...
  // )

  // const messageTable = await utilities.buildClassificationList()

  // //if (!mesResult) to test the else statement
  // if (mesResult) {
  //   //RPH: Recall so new message Inserted
  //   nav = await  utilities.getNav()


  //   req.flash(
  //     "notice",
  //     `Congratulations, message has been sent.`
  //   )
        
  //   // //Use exact file path
  //   //  res.status(201).render("message/messageinbox", {
  //   //     title: "Inventory Management",
  //   //     nav,
  //   //     messageTable,
  //   //     errors: null,
  //   //   })
  //    res.redirect("/message/messageinbox")
    
  // } else {
  //   req.flash("notice", "Sorry, the new message creation failed.")
  //   res.status(501).render("/message/newmessagepage", {
  //     title: "Add New Inventory",
  //     nav,
  //     classificationSelect,
  //     errors: null
  //   })
  // }
}

/* ***************************
 *  Archive this message
 * ************************** */
mesCont.archiveCurrentMessage = async function (req, res, next) {
  //const inv_id = parseInt(req.body.inv_id)
  let nav = await utilities.getNav()

  const mess_id = req.params.message_id 
  const archiveResult = await mesModel.archiveTheMessage(mess_id)

  if(archiveResult){  
    req.flash("notice", 'The message was successfully archived.')
    res.redirect('/message/messagearchiveinbox')
  } else {
    req.flash("notice", 'Sorry, archiving the failed.')
    res.redirect('/message/messagearchiveinnerinfo/'+mess_id)
  }
}

/* ***************************
 *  Delete opened row
 * ************************** */
mesCont.deleteCurrentMessagePage = async function (req, res, next) {
  //const inv_id = parseInt(req.body.inv_id)
  let nav = await utilities.getNav()

  const mess_id = req.params.message_id 
  const deleteResult = await mesModel.deleteTheMessage(mess_id)

  if(deleteResult){  
    req.flash("notice", 'The message deletion was successful.')
    res.redirect('/message/messageinbox')
  } else {
    req.flash("notice", 'Sorry, the delete failed.')
    res.redirect('/message/delete/'+mess_id)
  }
}

/* ***************************
 *  Reply to message
 * ************************** */
mesCont.replyToCurrentMessage = async function (req, res, next) {
  //const inv_id = parseInt(req.body.inv_id)
  let nav = await utilities.getNav()
  const mess_id = req.params.message_id 
  const myUsers = await mesCont.buildTheUserList()
  const accountData = await accountModel.getAccountByID(res.locals.accountData.account_id)
  const messageData = await mesModel.getMessageFeatures(mess_id);

  const message = await mesModel.getMessageFeatures(mess_id)
    
  console.log("FANG0 ")
  console.log("FANG5 "+ accountData.account_id)
  JSON.stringify(messageData)
  
  res.render("message/replynewmessagepage", {
    title: "Reply To: "+ accountData.account_firstname +" " + accountData.account_lastname,
    nav,
    errors: null,
    myUsers,
    messageData,
    accountData,
  })

  //await mesCont.registerNewMessage(req, res)
  console.log("FANG5 "+ mess_id)


  // if(deleteResult){  
  //   req.flash("notice", 'The message deletion was successful.')
  //   res.redirect('/message/messageinbox')
  // } else {
  //   req.flash("notice", 'Sorry, the delete failed.')
  //   res.redirect('/message/delete/'+mess_id)
  // }
}


/* ***************************
 *  Mark as read
 * ************************** */
mesCont.markAsRead22 = async function (req, res, next) {
  const message_id = parseInt(req.params.message_id)
  let nav = await utilities.getNav()

  let messageData = await mesModel.getMessageFeatures(message_id)
  mesModel.makeMessageRead(message_id)
  res.redirect("/message/messageinbox")
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

/* ****************************************
*  Deliver 1 archived message view
* *************************************** */
mesCont.buildExistingArchiveMessagePage = async function (req, res, next) {
  let nav = await utilities.getNav()
  const myUsers = await mesCont.buildTheUserList()
  const accountData = await accountModel.getAccountByID(res.locals.accountData.account_id)
  const mess_id = req.params.message_id
  const messageData = await mesModel.getMessageFeatures(mess_id);

  let anAccount = await accountModel.getAccountByID(messageData.message_from)
  let name2 = await mesCont.getFullNameFromId(messageData.message_from)

  let linktable = '<a href="/message/messageinbox" title="inbox">Return to Inbox</a><br>';
    
  linktable += "<form action='/message/edit/"+mess_id+"' method='post'>";
  linktable += ' <button type="submit"title="Click to mark message read">Mark as Read</button>';
  linktable += '</form>';
  
  linktable += "<form action='/message/deletion/"+mess_id+"' method='post'>";
  linktable += ' <button type="submit"title="Click to delete">Delete Message</button>';
  linktable += '</form>';

  res.render("message/messageinfo", {
    title: accountData.account_firstname +" " + accountData.account_lastname,
    nav,
    errors: null,
    myUsers,
    messageData,
    name2,
    linktable
  })
}

//Export for use
module.exports = mesCont