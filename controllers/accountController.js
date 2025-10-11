/* ************************************
 *  Account Controller
 *  Unit 4, deliver login view activity
 *  ******************************** */
const utilities = require('../utilities')
const accountModel = require('../models/account-model')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ****************************************
*  Deliver login view
*  Unit 4, deliver login view activity
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
  })
}

/* ****************************************
*  Deliver registration view
*  Unit 4, deliver register view activity
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
*  Unit 4, process registration activity
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash(
      "message failure",
      "Sorry, there was an error processing the registration."
    )
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "message success",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("message warning", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
 *  Process login request
 *  Unit 5, Login Process activity
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("message notice", "Please check your credentials and try again.")
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
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
 *  Deliver Account Management view
 *  Unit 5, Login Process activity
 **************************************** */
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    accountData: res.locals.accountData,
  })
}

/* ****************************************
 *  5 task 5
 **************************************** */
async function buildUpdate(req, res, next) {
  let nav = await utilities.getNav()
  const account_id = parseInt(req.params.id)
  const accountData = await accountModel.getAccountById(account_id)
  res.render("account/update", {
    title: "Account Edit",
    nav,
    errors: null,
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
  })
}

/* ****************************************
 *  5 task 5
 **************************************** */
async function processUpdate(req, res, next) {
  let nav = await utilities.getNav()
  const { account_id, account_firstname, account_lastname, account_email } =
    req.body

  const editResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  )

  if (editResult) {
    req.flash("message success", "The you entered has been updated.")
    // Rebuild the JWT with new data
    delete editResult.account_password
    const accessToken = jwt.sign(editResult, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: 3600 * 1000,
    })
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
    return res.redirect("/account/")
  } else {
    req.flash("message warning", "Sorry, the update failed.")
    return res.redirect(`/account/update/${account_id}`)
  }
}

/* ****************************************
 *  5 task 5
 **************************************** */
async function processPassword(req, res, next) {
  let nav = await utilities.getNav()
  const { account_id, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // pass regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash(
      "message warning",
      "Sorry, there was an error processing the password change."
    )
    return res.redirect(`/account/update/${account_id}`)
  }

  const passwordResult = await accountModel.updatePassword(
    hashedPassword,
    account_id
  )

  if (passwordResult) {
    req.flash("message success", "Password updated. Please logout and login to verify.")
    return res.redirect('/account/')

  } else {
    req.flash("message warning", "Sorry, the password update failed.")
    return res.redirect(`/account/update/${account_id}`)
  }
}

/* ****************************************
 *  5 task 6
 * ************************************ */
async function accountLogout(req, res) {
  res.clearCookie("jwt")
  res.locals.loggedin = ''
  return res.redirect("/")
}


module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildManagement, buildUpdate, processUpdate, processPassword, accountLogout }