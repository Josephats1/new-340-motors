/* ***********************************
 * Created in Unit 4
 * Modified in Unit 5
 *********************************** */
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Classification Data Validation Rule
 *  Assignment 4, Task 2
 * ********************************* */
validate.classificationRule = () => {
  return [
    // name is required and must be string
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .isAlpha()
      .withMessage("Provide a correct classification name."),
  ]
}

/* ******************************
 * Check and return error or continue to insert classification
 *  Assignment 4, Task 2
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

/*  **********************************
 *  New Vehicle Data Validation Rules
 *  Assignment 4, Task 3
 * ********************************* */
validate.newInventoryRules = () => {
  return [
    body("classification_id")
      .trim()
      .isInt({
        no_symbols: true,
      })
      .withMessage("The vehicle's classification is required."),

    body("inv_make")
      .trim()
      .escape()
      .isLength({
        min: 3,
      })
      .withMessage("A vehicle make is required."),

    body("inv_model")
      .trim()
      .escape()
      .isLength({
        min: 3,
      })
      .withMessage("A vehicle model is required."),

    body("inv_description")
      .trim()
      .escape()
      .isLength({
        min: 3,
      })
      .withMessage("A vehicle description is required."),

      body("inv_image")
      .trim()
      .isLength({
        min: 6,
      })
      .matches(/\.(jpg|jpeg|png|webp)$/)
      .withMessage("A vehicle image path is required and must be an image."),

    body("inv_thumbnail")
      .trim()
      .isLength({
        min: 6,
      })
      .matches(/\.(jpg|jpeg|png|webp)$/)
      .withMessage("A vehicle thumbnail path is required and must be an image."),

    body("inv_price")
      .trim()
      .isDecimal()
      .withMessage("A vehicle price is required."),

    body("inv_year")
      .trim()
      .isInt({
        min: 1900,
        max: 2099,
      })
      .withMessage("A vehicle year is required."),

    body("inv_miles")
      .trim()
      .isInt({
        no_symbols: true,
      })
      .withMessage("The vehicle's miles is required."),

    body("inv_color")
      .trim()
      .escape()
      .isLength({
        min: 3,
      })
      .withMessage("The vehicle's color is required."),
  ]
}

/* ******************************
 *  Check data and return errors or continue to new vehicle
 *  Assignment 4, Task 3
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const {
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    )
    res.render("inventory/add-inventory", {
      errors,
      title: "Add Vehicle",
      nav,
      classificationSelect,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    })
    return
  }
  next()
}

/* ******************************
 *  Check update data and return errors or continue to edit view
 *  Unit 5, Update Step 2 activity
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const {
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
    inv_id,
  } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    )
    res.render("inventory/edit-inventory", {
      errors,
      title: `Edit ${inv_make} ${inv_model}`,
      nav,
      classificationSelect,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      inv_id,
    })
    return
  }
  next()
}

module.exports = validate
