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

//Controller Connection
// Keep all your existing requires and setup




const { upload, handleUploadErrors } = require("../utilities/upload-config");
const path = require('path');
const fs = require('fs');

// KEEP THIS - your existing upload route
router.post(
    "/upload",
    utilities.checkLogin,
    upload.single("profile"),
    handleUploadErrors,
    utilities.handleErrors(accountController.uploadProfilePicture)
);

// ADD THIS - route to serve profile images
router.get("/profile-image/:filename", (req, res) => {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, '../public/uploads', filename);
    
    if (!fs.existsSync(imagePath)) {
        return res.status(404).send('Image not found');
    }
    
    res.sendFile(imagePath);
});

// KEEP THESE - your debug routes (they're useful!)
router.get("/debug-upload", utilities.checkLogin, (req, res) => {
    console.log("Upload directory:", path.join(__dirname, "../public/uploads"))
    console.log("Directory exists:", fs.existsSync(path.join(__dirname, "../public/uploads")))
    res.json({
        uploadDir: path.join(__dirname, "../public/uploads"),
        exists: fs.existsSync(path.join(__dirname, "../public/uploads")),
        user: res.locals.accountData
    })
});

router.get("/debug-profile", utilities.checkLogin, async (req, res) => {
    const account_id = res.locals.accountData.account_id
    const currentUser = await accountModel.getAccountById(account_id)
    
    res.json({
        account_id: account_id,
        current_profile_image: currentUser.account_profile_image,
        uploads_directory: path.join(__dirname, "../public/uploads"),
        files_in_uploads: fs.readdirSync(path.join(__dirname, "../public/uploads"))
    })
});
// Serve profile images from uploads folder
router.get("/profile-image/:filename", (req, res) => {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, '../public/uploads', filename);
    
    // Check if file exists
    if (!fs.existsSync(imagePath)) {
        return res.status(404).send('Image not found');
    }
    
    res.sendFile(imagePath);
});
// Test route to check image serving
router.get("/test-image/:id", utilities.checkLogin, async (req, res) => {
    try {
        const account_id = req.params.id;
        const user = await getAccountById(account_id);
        
        if (!user || !user.account_profile_image) {
            return res.send('No profile image found');
        }

        const imagePath = path.join(__dirname, '../public/uploads', user.account_profile_image);
        
        if (fs.existsSync(imagePath)) {
            res.send(`
                <h1>Profile Image Test</h1>
                <p>Filename: ${user.account_profile_image}</p>
                <p>File exists: YES</p>
                <img src="/account/profile-image/${user.account_profile_image}" 
                     alt="Test" style="max-width: 300px;">
                <hr>
                <p>Also try direct link:</p>
                <a href="/account/profile-image/${user.account_profile_image}">
                    /account/profile-image/${user.account_profile_image}
                </a>
            `);
        } else {
            res.send(`
                <h1>Profile Image Test - FILE NOT FOUND</h1>
                <p>Filename: ${user.account_profile_image}</p>
                <p>Expected path: ${imagePath}</p>
                <p>Files in uploads: ${fs.readdirSync(path.join(__dirname, '../public/uploads'))}</p>
            `);
        }
    } catch (error) {
        res.send('Error: ' + error.message);
    }
});
module.exports = router