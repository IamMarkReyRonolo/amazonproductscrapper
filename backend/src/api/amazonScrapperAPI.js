const express = require("express");
const amazonScrapperController = require("../controller/amazonScrapperController");
const router = express.Router();

router.get("/", amazonScrapperController.scrapebyKeyword);

module.exports = router;
