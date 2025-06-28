const express = require("express");
const router = express.Router();
const { getInvoice, addInvoice } = require("../controllers/invoiceControllers");
const { verifyUser } = require("../middleware/auth");
const upload = require("../middleware/multerConfig");
const sharpMiddleware = require("../middleware/sharpMiddleware");

router.get("/getInvoices", verifyUser, getInvoice);

router.post("/addInvoice", verifyUser,upload.single("image"), sharpMiddleware(), addInvoice, (req, res) => {
        if (!req.file) {
            return res.status(400).json({ error: "Error uploading the file. Wrong format?" });
        }

        console.log(req.body); 
        console.log(req.file); 
        console.log(req.userId); 

        const fileUrl = req.protocol + "://" + req.get("host") + "/" + req.file.processedPath;
        res.json({ message: "User response reached", fileUrl });
    }
);

module.exports = router;