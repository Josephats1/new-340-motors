/* ************************************
 *  Account routes
 *  Unit 4, deliver login view activity
 *  ******************************** */
// Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require("../utilities/account-validation")

/* ************************************
 *  Deliver Login View
 *  Unit 4, deliver login view activity
 *  ******************************** */
router.get("/login", utilities.handleErrors(accountController.buildLogin))

/* ************************************
 *  Deliver Registration View
 *  Unit 4, deliver registration view activity
 *  ******************************** */
router.get("/register", utilities.handleErrors(accountController.buildRegister))

/* ************************************
 *  Process Registration
 *  Unit 4, process registration activity
 *  ******************************** */
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

/* ************************************
 *  Process Login
 *  Unit 4, stickiness activity
 *  Modified in Unit 5, Login Process activity
 *  ******************************** */
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

/* ************************************
 *  Deliver Account Management View
 *  Unit 5, JWT Authorization activity
 *  ******************************** */
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildManagement)
)


/* ****************************************
 *5 /5
 **************************************** */
router.get(
  "/update/:id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdate)
)

/* ****************************************
 *5 -5
 **************************************** */
router.post(
  "/update",
  utilities.checkLogin,
  regValidate.updateRules(),
  regValidate.checkEditData,
  utilities.handleErrors(accountController.processUpdate)
)

/* ****************************************
5-5
 **************************************** */
router.post(
  "/password",
  utilities.checkLogin,
  regValidate.passwordRule(),
  regValidate.checkPassword,
  utilities.handleErrors(accountController.processPassword)
)

/* ****************************************
5-6
 **************************************** */
router.get(
  "/logout",
  utilities.handleErrors(accountController.accountLogout)
)

module.exports = router