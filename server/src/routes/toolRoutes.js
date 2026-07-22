const express = require('express');
const router = express.Router();
const {
  createTool,
  getTools,
  getToolById,
  getUserListings,
  updateTool,
  deleteTool
} = require('../controllers/toolController');
const { protect } = require('../middlewares/auth');

router.route('/')
  .get(getTools)
  .post(protect, createTool);

router.get('/my-listings', protect, getUserListings);

router.route('/:id')
  .get(getToolById)
  .put(protect, updateTool)
  .delete(protect, deleteTool);

module.exports = router;
