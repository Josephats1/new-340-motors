const multer = require("multer")
const path = require("path")
const fs = require("fs")

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../public/uploads")
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

// Set storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9)
        cb(null, "profile-" + uniqueSuffix + path.extname(file.originalname))
    }
})

// Validate file type
function fileFilter(req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (mimetype && extname) {
        return cb(null, true)
    } else {
        cb(new Error("Only image files (JPEG, JPG, PNG, GIF) are allowed!"), false)
    }
}

// Multer setup
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: fileFilter
})

// Error handling middleware for Multer
const handleUploadErrors = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            req.flash("message warning", "File too large. Maximum size is 2MB.")
            return res.redirect("/account/update")
        }
    } else if (err) {
        req.flash("message warning", err.message)
        return res.redirect("/account/update")
    }
    next()
}

module.exports = { upload, handleUploadErrors }