const express = require('express');
const router = express.Router();
const { toggleFavorite, getUserFavorites } = require('../controllers/favoriteController');
const { protect } = require('../middlewares/auth');

router.use(protect);

router.post('/toggle', toggleFavorite);
router.get('/', getUserFavorites);

module.exports = router;
