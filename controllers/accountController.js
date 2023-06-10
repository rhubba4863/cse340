const utilities = require("../utilities/") //RPH 4
const bcrypt = require("bcryptjs")
const accountModel = require("../models/account-model.js")


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
*  Process Login (RPH maybe not required???)
* *************************************** */
//RPH Attempt
async function loginAccount(req, res) {
  let nav = await utilities.getNav()
  const { 
    account_firstname, 
    account_email, 
  } = req.body

  //Where the data is sent to the modal
  // const regResult = true;
  const regResult = await accountModel.registerAccount(
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname} to log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", `Sorry, login to ${account_firstname} failed.`)
    res.status(501).render("account/login", {
      title: "Login",
      nav,
    })
  }
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

//Export for use
module.exports = { buildLogin, buildRegister,  registerAccount}