/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()

const baseController = require("./controllers/baseController") //RPH 2
const utilities = require("./utilities/") //RPH 4
// rph Unit 4
const session = require("express-session")
const pool = require('./database/')
// Unit 4: 
const bodyParser = require("body-parser")
//Unit 5:
const cookieParser = require("cookie-parser")


/* ***********************
 * Middleware - Unit 4
 * Create table if missing, and add to the database pool
 * ************************/ 
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true, 
  name: 'sessionId',
}))

// Unit 4
// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
//Unit 5, Login Activity
app.use(cookieParser())
//Unit 5, Login Process Activity
app.use(utilities.checkJWTToken)


/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 * RPH: Ex: when a route of "/account" ... it will be forwarded 
 * to accounteRoute file "./routes/accountRoute" for handling
 *************************/
app.use(require("./routes/static"))

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory routes
app.use("/inv", require("./routes/inventoryRoute"))
// Unit 4 - Account Routes
app.use("/account", require("./routes/accountRoute"))



// error link - Simpler
app.get("/error", utilities.handleErrors(baseController.errorFunc))

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  // console.log(`app listening on ${host}:${port}`)
  console.log(`app listening on http://${host}:${port}`)
})
