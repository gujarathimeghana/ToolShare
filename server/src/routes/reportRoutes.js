const express = require('express');
const router = express.Router();
const { createReport, getReports, updateReportStatus } = require('../controllers/reportController');
const { protect } = require('../middlewares/auth');
const { adminOnly } = require('../middlewares/admin');

router.post('/', protect, createReport);
router.get('/', protect, adminOnly, getReports);
router.put('/:id/status', protect, adminOnly, updateReportStatus);

module.exports = router;
