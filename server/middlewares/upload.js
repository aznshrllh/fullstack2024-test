// const multer = require("multer");
// const multerS3 = require("multer-s3");
// const { s3 } = require("../config/aws");
// const path = require("path");

// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: process.env.AWS_S3_BUCKET,
//     acl: "public-read",
//     metadata: function (req, file, cb) {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: function (req, file, cb) {
//       const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//       cb(
//         null,
//         "client-logos/" + uniqueSuffix + path.extname(file.originalname)
//       );
//     },
//   }),
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith("image/")) {
//       cb(null, true);
//     } else {
//       cb(new Error("Not an image! Please upload an image file."), false);
//     }
//   },
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB
//   },
// });

// module.exports = upload;

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create directory if it doesn't exist
const uploadsDir = path.join(__dirname, "..", "uploads", "client-logos");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Configure upload middleware
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Not an image! Please upload an image file."), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Add location property similar to S3 behavior
const fileMiddleware = (req, res, next) => {
  if (req.file) {
    // Create a URL that resembles an S3 URL
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    req.file.location = `${baseUrl}/uploads/client-logos/${req.file.filename}`;
  }
  next();
};

// Return an array with both middleware functions
const fileUpload = {
  single: (fieldName) => [upload.single(fieldName), fileMiddleware],
};

module.exports = fileUpload;
