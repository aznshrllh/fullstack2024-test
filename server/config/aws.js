const path = require("path");
const fs = require("fs");
const { S3Client } = require("@aws-sdk/client-s3");

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "..", "uploads", "client-logos");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure S3 Client
const s3Config = {
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "test",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "test",
  },
};

// For using local files instead of S3
let s3 = {
  deleteObject: (params) => {
    return {
      promise: async () => {
        try {
          const filePath = path.join(uploadsDir, params.Key.split("/").pop());
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
          return { success: true };
        } catch (error) {
          console.error("Error deleting file:", error);
          throw error;
        }
      },
    };
  },
};

// Export the configured S3 client
module.exports = { s3 };
