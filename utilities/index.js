const invModel = require("../models/inventory-model")
const accModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the  HTML 
 ************************** */


/* ************************
 * Constructs the nav HTML unordered list
 * RPH: Header links
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul class='header-link-options'>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

//First try all messages, then those for 
//specific guy
Util.getMessages = async function (){
  let data = await accModel.getMessages()

  //accModel
}

 // Build inventory items into HTML table components and inject into DOM 
Util.buildMessageList = async function() {
  let data = await accModel.getMessages()
  let messageTable = '<tbody>'; 
   
  messageTable += '<table>'; 
  messageTable += '<thead>';
  messageTable += '<tr><th>Received</th><th>Subject</th><th>From</th><th>Read</th></tr>'; 
  messageTable += '</thead>';
  console.log("ROW: "+data.rows.length)

  //https://stackoverflow.com/questions/4380469/how-do-you-convert-a-javascript-timestamp-into-utc-format?rq=3
  //https://www.w3schools.com/html/html_table_padding_spacing.asp
  // https://www.w3schools.com/js/js_date_formats.asp
  data.rows.forEach(oneMessage => {
    let bday = oneMessage.message_created;
    console.log("help1")
    console.log("help2 "+ (new Date(bday)).toUTCString())
    console.log("help3 "+ (getDateFrom(bday)))
    console.log("help4 " )



    messageTable += '<tr>'
    messageTable += '<td>' + bday.getDate() +" "+ bday.getTime()+ '</td>' 
    messageTable += '<td><a href="/account/ROUTERNAME" title="View Message">' 
      + oneMessage.message_subject + '</a></td>'
    messageTable += '<td>' + oneMessage.message_from + '</td>'
    messageTable += '<td>' + oneMessage.message_read + '</td>'
    messageTable += '</tr>'
  }) 
  messageTable += '</table>'; 
  messageTable += '</tbody>'; 

  return messageTable  
}
  
function getDateFrom (date){


  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  if(hours == 0){
    hours = 12;
  }
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getDate
return date.getMonth() + '/' + (date.getDate()+1) + '/' + date.getFullYear() + ", " + strTime
}
  
//   let data = await accModel.getMessages()
 
//  // let inventoryDisplay = document.getElementById("normalMessages"); 
//   // Set up the table labels 
//   let messageTable = '<thead>'; 
//   messageTable += '<tr><th>Received</th><th>Subject</th><th>From</th><th>Read</th></tr>'; 
//   messageTable += '</thead>'; 
//   // Set up the table body 
//   messageTable += '<tbody>'; 
//   // Iterate over all vehicles in the array and put each in a row 
//   data.forEach(function (element) { 
//     //  console.log(element.inv_id + ", " + element.inv_model); 
//     messageTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`;    
//   }) 
//   dataTable += '</tbody>'; 
//   // Display the contents in the Inventory Management view 
//   //inventoryDisplay.innerHTML = dataTable; 
// }

/* ************************
 * Constructs the dropdown HTML list
 * a.k.a getClassTypes()
 ************************** */
Util.buildClassificationList = async function(req, res, next){
  let data = await invModel.getClassifications()
  let classifications = '<select name="classification_id" id="classificationList">'
  classifications +=  '<option value="none" selected disabled hidden>Choose here</option>'
  data.rows.forEach(classification => {
    classifications += '<option value="' + classification.classification_id + '">' + classification.classification_name + "</option>"
  }) 
  classifications += '</select>'
  return classifications
}

/* ************************
 * Constructs the user dropdown HTML list
 * a.k.a getClassTypes()
 ************************** */
Util.buildUserList = async function(req, res, next){
  let data = await accModel.getUsers()
  let classifications = '<select name="account_id" id="accountList">'
  classifications +=  '<option value="none" selected disabled hidden>Select a recipient</option>'
  data.rows.forEach(user => {
    classifications += '<option value="' + user.account_id + '">' + user.account_firstname 
    + " " + user.account_lastname + "</option>"
  }) 
  classifications += '</select>'
  return classifications
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li class="car-modal">'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* 3rd lvl: Car and its description
* ************************************ */
Util.buildCarDetailView = async function(data){
  let grid = '<ul id="inv-car-modal">'
  let pictureSide
  let detailSide

  pictureSide = '<li class="inv-car-modal-columns"><div>'
  + '<img id="mainCarPicture" src="'+data.inv_image+'">'
  + '</div></li>';

  detailSide =  '<li class="inv-car-modal-columns"><div id=mainCarDetails>'
  + '<div id="infoTitle">About this item</div>'
  + '<div><span class="bold">Milage: </span>'+
  new Intl.NumberFormat('en-US').format(data.inv_miles) +'</div>'
  + '<div><span class="bold">Price: </span>$'+
  new Intl.NumberFormat('en-US').format(data.inv_price)+'</div>'
  + '<div><span class="bold">Color: </span>'+data.inv_color+'</div>'
  + '<div><span class="bold">Description: </span>'+data.inv_description+'</div>'
  + '<div><span class="bold">Stock Number: </span>'+data.classification_id+'</div>'
  + '</li>';

  grid += pictureSide
  grid += detailSide
  grid += '</ul>'

  return grid;
}

/***************************
 * Error Steps (Step 4)
 ***************************/ 
Util.buildByError = async function(data){
  let grid = '<div>Server Error</div>'
  + '<div>Oh no! There was a crash. Maybe try a different route<div>';

  return grid;
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

Util.passwordShow = async function(){
  const pswdButton = document.querySelector("passwordButton");
  pswdButton.addEventListener("click", function(){
    const pswdInput = document.querySelector("");
    const type = pswdButton.getAttribute("type");

    if(type == "password"){
      pswdInput.setAttribute("type", "text");
      pswdButton.innerHTML = "Hide Password";
    }else {
      pswdInput.setAttribute("type", "password");
      pswdButton.innerHTML = "Show Password";
    }
  });
}

/* ****************************************
* Unit5: Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
      //If Invalid
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1

     next()
    })
  } else {
    //If no cookie, moves to next procss
   next()
  }
 }

 /* ****************************************
 *  Check Logging out
 *  Unit 5
 * ************************************ */
 Util.makeLogout = (req, res, next) => {
  req.flash("notice","Please log in")
  res.clearCookie("jwt")
  return res.redirect("/account/login")
 }

 /* ****************************************
 *  Check Login
 *  Unit 5, jwt, authorize activity
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  //First check the flag, if authorized
  if (res.locals.loggedin) {
    next()
  } else {
    //Steps
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }


Util.checkUserPermission = async (req, res, next) => {
  const rank = (res.locals.accountData.account_type)
  
  if(rank=="Employee" || rank=="Admin"){
    next() 
  }else{
    req.flash("error", "Please log in or use different account.")
    return res.redirect("/account/login")
  }
}

 /* ****************************************
 *  Messages
 *  
 * ************************************ */


//NOTE - ALWAYS LAST STEP - RPH/TEACHER
module.exports = Util