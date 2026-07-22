const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, toggleUserStatus } = require('../controllers/adminController');
const { protect } = require('../middlewares/auth');
const { adminOnly } = require('../middlewares/admin');

router.use(protect);
router.use(adminOnly);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle', toggleUserStatus);

module.exports = router;
