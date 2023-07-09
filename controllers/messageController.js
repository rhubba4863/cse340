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
  console.log("FREDGEORGE1")
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
  console.log("FREDGEORGE2")
  const accModel = require("../models/account-model.js")
  let data = await accModel.getUsers()
  console.log("FREDGEORGE2-A")
  let classifications = '<select name="message_to" id="accountList">'
  console.log("FREDGEORGE2-B")
  console.log("FREDGEORGE2-C")

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
  console.log("FREDGEORGE3")
  let nav = await utilities.getNav()
  const myUsers = await mesCont.buildTheUserList()
  //const myUsers = await utilities.buildTheUserList()

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
  console.log("FREDGEORGE4")
  
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
  console.log("FREDGEORGE5")
  let nav = await utilities.getNav()
  const myUsers = await mesCont.buildTheUserList()
  const accountData = await accountModel.getAccountByID(res.locals.accountData.account_id)
  const mess_id = req.params.message_id
  const messageData = await mesModel.getMessageFeatures(mess_id);

  let anAccount = await accountModel.getAccountByID(messageData.message_from)
  let name2 = await mesCont.getFullNameFromId(messageData.message_from)

  let linktable = '<a href="/message/messageinbox" title="inbox">Return to Inbox</a><br>';
  linktable += "<form action='/message/reply/"+mess_id+"' method='get'>";
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
  console.log("FREDGEORGE6")
  console.log("BEN HUR1")
  let nav = await utilities.getNav()
  
  let { 
    message_subject, message_body, 
    message_created, message_to, 
    message_from,    message_read, 
    message_archived,
    //All peices transferred: ...
  } = req.body

  console.log("BEN HUR2")

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
  const myUsers = await mesCont.buildTheUserList()
   
  console.log("FAILURE"+mesResult+"XXX")

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
      myUsers,
      errors: null
    })
  }
}

/* ************************************  
* Build the reply message view  
* ************************************/ 
mesCont.buildReplyMessagePage = async function (req, res, next) {    
  console.log("FREDGEORGE-7")
  const message_id = req.params.message_id;     
  let nav = await Util.getNav();     
  let messageData = await mesModel.getMessage(message_id); 

  const accountData = await accountModel.getAccountByID(res.locals.accountData.account_id)
   
  res.render('./message/reply/'+message_id, {         
    title: "Reply to: " + messageData.account_firstname + " " + messageData.account_lastname,         
    nav,         
    messageData,  
    accountData,      
    errors: null     
  });   
}

/* ************************************  
* Send the reply to the database, then return to main page  
* ************************************/ 
mesCont.registerNewMessageFromReply = async function (req, res, next) {
  console.log("FREDGEORGE-8")
  console.log("JURASSIC PARK1")
  let nav = await utilities.getNav()
  let { 
    message_subject, message_body, 
    message_created, message_to, 
    message_from,    message_read, 
    message_archived,
    //All peices transferred: ...
  } = req.body

  //Edit the message into a response
  message_subject = "RE: "+ message_subject
  //const oneAccount = await accountModel.getAccountByID(res.locals.accountData.account_id)
  // message_to
  // message_from

  console.log("JURASSIC PARK2" + JSON.stringify(req.body))

  console.log("PRINCE1:"+ message_subject+"X")
  console.log("PRINCE2:"+ message_body+"X")
  console.log("PRINCE3:"+ message_created+"X")
  console.log("PRINCE4:"+ message_to+"X")
  console.log("PRINCE5:"+ message_from+"X")
  console.log("PRINCE6:"+ message_read+"X")
  console.log("PRINCE7:"+ message_archived+"X")

  let temp;

  temp = message_from;
  message_from = message_to;
  message_to = temp;

  //console.log("MAGIC8 "+res.locals.accountData.account_firstname) 
  
  message_from = res.locals.accountData.account_id  
  console.log("PRINCE8"+ message_from+"X")

  //Where the data is sent to the modal
  const mesResult = await mesModel.registerIntoMessages(
    message_subject, message_body, 
    message_created, message_to, 
    message_from,    message_read, 
    message_archived,
    //All peices transferred: ...
  )

  //if (!mesResult) to test the else statement
  if (mesResult) {
    //RPH: Recall so new message Inserted
    nav = await  utilities.getNav()

    req.flash(
      "notice",
      "Congratulations, message \""+ message_subject+ "\" has been sent."
    )
        
    // //Use exact file path
    //  res.status(201).render("message/messageinbox", {
    //     title: "Inventory Management",
    //     nav,
    //     messageTable,
    //     errors: null,
    //   })

    console.log("CHIPMUNK 1:") 
    res.redirect("/message/messageinbox")
  } else {
    console.log("CHIPMUNK 2:")
    const myUsers = await mesCont.buildTheUserList()


    req.flash("notice", "Sorry, the new message creation failed.")
    res.status(501).render("/message/newmessagepage/", {
      title: "Add New Inventory",
      nav,
      classificationSelect,
      myUsers,
      errors: null
    })
  }
}

/* ***************************
 *  Archive this message
 * ************************** */
mesCont.archiveCurrentMessage = async function (req, res, next) {
  console.log("FREDGEORGE-9")
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
  console.log("FREDGEORGE-10")
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
  console.log("FREDGEORGE-11")
  //const inv_id = parseInt(req.body.inv_id)
  let nav = await utilities.getNav()
  const mess_id = req.params.message_id 
  const myUsers = await mesCont.buildTheUserList()
  const accountData = await accountModel.getAccountByID(res.locals.accountData.account_id)
  const messageData = await mesModel.getMessageFeatures(mess_id);

  const message = await mesModel.getMessageFeatures(mess_id)
    
  console.log("FANG0 ")
  console.log("FANG5 "+ accountData.account_id)
  console.log("FANG5 "+ JSON.stringify(messageData))

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
  console.log("FREDGEORGE-12")

  const message_id = parseInt(req.params.message_id)
  let nav = await utilities.getNav()

  let messageData = await mesModel.getMessageFeatures(message_id)
  mesModel.makeMessageRead(message_id)
  res.redirect("/message/messageinbox")
}


mesCont.buildUserList = async function(req, res, next){
  console.log("FREDGEORGE-13")

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
  console.log("FREDGEORGE-4")

  let anAccount = await accountModel.getAccountByID(id)
  let name = anAccount.account_firstname + " "+ anAccount.account_lastname
  return name;
}

/* ****************************************
*  Deliver 1 archived message view
* *************************************** */
mesCont.buildExistingArchiveMessagePage = async function (req, res, next) {
  console.log("FREDGEORGE-15")
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