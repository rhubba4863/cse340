const utilities = require("../utilities/") //RPH 4
const accountModel = require("../models/account-model.js")
const mesModel = require("../models/message-model.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { 
    account_firstname, 
    account_lastname, 
    account_email, 
    account_password 
  } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  //Where the data is sent to the modal
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
*  Deliver account view
* *************************************** */
async function buildAccount(req, res, next) {
  const data = (res.locals.accountData)

  let nav = await utilities.getNav()
  let manageVersion = await getManagementPage(data)

  res.render("./account/account-Management", {
    title: "Account Management",
    nav,
    manageVersion,
    errors: null,
  })
}

async function getManagementPage (data) {
  let rank = data.account_type
  let name = data.account_firstname
  let unread= (await mesModel.getUnreadMessages(data.account_id)).rows.length
  let view = "";

  //PARKER XXX
  view += "<h2>Welcome "+name+"</h2>"
  view += "<label>You're logged in</label><br>"
  view += '<p class="casualLink"><a href="/account/update-View" title="Edit Users Account">Edit Account Information</a></p>'
  view += "<h3>Message Center</label></h3>"
  view += "<ul>"
  view += "<li>You have "+unread+" unread messages</li>"
  view += '<li>Go to <a href="/message/messageinbox" title="Message Inbox">inbox</a></li>'
  view += "</ul>"

  if(rank=="Employee" || rank=="Admin"){
    view += "<h3>Inventory Management</h3>"
    view += '<p class="casualLink"><a href="/inv" title="Oversee Inventory">Manage Inventory</a></p>'
  }else{
  }

  return view
}



/* ****************************************
*  Deliver edit user view
* *************************************** */
async function buildAccountEdit(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./account/update-View", {
    title: "Edit Account",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver edit user view
* *************************************** */
async function buildLogout(req, res, next) {
  res.clearCookie('jwt')
  res.redirect('/');
  req.flash("notice","Successfully logged out")
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })

   return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
    delete accountData.account_password
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
    return res.redirect("/account/")
   }else {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
     })
  }
  } catch (error) {
    return new Error('Access Forbidden')
  }
 }

 /* ****************************************
*  Process Registration
* *************************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  const { 
    account_firstname, 
    account_lastname, 
    account_email, 
    account_id 
  } = req.body

  //Where the data is sent to the modal
  const regResult = await accountModel.updateAccountToDatabase(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, your information has been updated.`
    )  
    
    //Try to remove previous token for new results
    res.clearCookie("jwt")
    const accountData = await accountModel.getAccountByID(account_id)
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })

    //Recreate page for link
    const data = (res.locals.accountData)
    let manageVersion = await getManagementPage(data)

    //Figure how to return to http://localhost:5500/account
    // "" and "account/update-View" work, but not "account" 
    //or "account/account-Management"
    res.status(201).redirect("/account/") //redirect, place exact URL
  } else {
    req.flash("notice", "Sorry, the account edit failed.")
    res.status(501).render("account/update-View", {
      title: "Edit Account89",
      nav,
      errors: null,
    })
  }
}

async function updateAccountPassword(req, res) {
  let nav = await utilities.getNav()
  const { 
    account_password, 
    account_id 
  } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/update-View", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

   //Where the data is sent to the modal
  const regResult = await accountModel.updateAccountPasswordToDatabase(
    hashedPassword,
    account_id
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, your password has been updated.`
    )

    //Try to remove previous token for new results
    res.clearCookie("jwt")
    const accountData = await accountModel.getAccountByID(account_id)
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })

    //Recreate page for link
    const data = (res.locals.accountData)
    let manageVersion = await getManagementPage(data)

    //Account Management
    res.status(201).redirect("/account/") //redirect, place exact URL

    // res.status(201).render("account/account-Management", {
    //   title: "Login22",
    //   nav,
    //   manageVersion,
    //   errors: null,
    // })    
  } else {
    req.flash("notice", "Sorry, the password update failed.")

    res.status(501).render("account/update-View", {
      title: "Edit Account",
      nav,
      errors: null,
    })
  }
}




//Export for use
module.exports = { buildLogin, buildRegister,  registerAccount, accountLogin, 
  buildAccount, buildAccountEdit, updateAccount, updateAccountPassword, buildLogout}