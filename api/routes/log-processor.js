const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const LogProcessorController = require('../controllers/log-processor');

router.post("/process", checkAuth, LogProcessorController.process_logs);
router.post("/process_dummy_api", checkAuth, LogProcessorController.process_log_dummy_api);

module.exports = router;
