const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require("dotenv").config();
const { uploadOnCloudinary } = require('./cloudinary');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT;

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Specify the directory for storing uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${path.extname(file.originalname)}`);  // Use a unique filename with a timestamp
    }
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Endpoint for handling media uploads
app.post("/post_media", upload.single('media'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const localFilePath = req.file.path;
        const cloudinaryResponse = await uploadOnCloudinary(localFilePath);

        if (cloudinaryResponse) {
            return res.status(200).json({ url: cloudinaryResponse.url });
        } else {
            return res.status(500).json({ error: "Failed to upload file to Cloudinary" });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log("Server has been started at link: " + `http://localhost:${PORT}/`);
});
