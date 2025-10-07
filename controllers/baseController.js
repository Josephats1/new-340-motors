const utilities = require("../utilities")
const baseController = {}

/* ***************************
 *  Build Home view with MVC
 *  Unit 3, MVC: Get Started Activity
 *  Flash message Unit 4, Sessions & Messages activity
 * ************************** */
baseController.buildHome = async function (req, res) {
  const nav = await utilities.getNav()
  // req.flash("notice", "This is a flash message.")
  res.render("index", { title: "Home", nav })
}

module.exports = baseController