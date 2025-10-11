/* ***********************************
  * Created in Unit 4
  * Modified in Unit 5 
 *********************************** */
const utilities = require(".")
const accountModel = require("../models/account-model")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Registration Data Validation Rules
 *  Unit 4, server-side activity
 * ********************************* */
validate.registationRules = () => {
  return [
    // name is required and must be string
    body("account_firstname")
      .trim()
      .isString()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // name is required and must be string
    body("account_lastname")
      .trim()
      .isString()
      .isLength({ min: 1 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the database
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        
        console.log(account_email)
        if (emailExists) {
          throw new Error("Email exists. Please login or use different email")
        }
      }),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

// See https://www.geeksforgeeks.org/how-to-check-if-email-address-is-already-in-use-or-not-using-express-validator-in-node-js/ for email exists check
/* ******************************
 * Check data and return errors or continue to registration
 *  Unit 4, server-side activity
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

/*  **********************************
 *  Login Data Validation Rules
 *  From "Stickiness" activity
 * ********************************* */
validate.loginRules = () => {
  return [
    // valid email is required and cannot already exist in the database
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required."),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    })
    return
  }
  next()
}

/*  **********************************
 *  Account Update Validation Rules
 *  Unit 5, Assignment 5, Task 5
 * ********************************* */
validate.updateRules = () => {
  return [
    // name is required and must be string
    body("account_firstname")
      .trim()
      .isString()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // name is required and must be string
    body("account_lastname")
      .trim()
      .isString()
      .isLength({ min: 1 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required
    // if email is being changed, it cannot already exist in the database
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email, { req }) => {
        const account_id = req.body.account_id
        const account = await accountModel.getAccountById(account_id)
        // Check if submitted email is same as existing
        if (account_email != account.account_email) {
          // No  - Check if email exists in table
          const emailExists = await accountModel.checkExistingEmail(
            account_email
          )
          // Yes - throw error
          if (emailExists.count != 0) {
            throw new Error("Email exists. Please use a different email")
          }
        }
      }),
  ]
}

/* ******************************
 * Check data and return errors or continue to update
 *  Unit 5, Assignment 5, Task 5
 * ***************************** */
validate.checkEditData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_id } =
    req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/update", {
      errors,
      title: "Edit Account",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    })
    return
  }
  next()
}

/*  **********************************
 *  Update Password Validation Rule
 *  Unit 5, Assignment 5, Task 5
 * ********************************* */
validate.passwordRule = () => {
  return [
    // password is required and must be strong password
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
 * Check password and return errors or continue to change
 *  Unit 5, Assignment 5, Task 5
 * ***************************** */
validate.checkPassword = async (req, res, next) => {
  const account_password = req.body.account_password
  const account_id = parseInt(req.body.account_id)
  const accountData = await accountModel.getAccountById(account_id)
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/update", {
      errors,
      title: "Edit Account",
      nav,
      account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
    })
    return
  }
  next()
}

module.exports = validate
