const express = require('express');
const router = express.Router();
const {
  createHelpRequest,
  getHelpRequests,
  getHelpersList,
  acceptHelpJob,
  updateHelpStatus
} = require('../controllers/helpController');
const { protect } = require('../middlewares/auth');

router.route('/')
  .get(getHelpRequests)
  .post(protect, createHelpRequest);

router.get('/helpers', getHelpersList);
router.put('/:id/accept', protect, acceptHelpJob);
router.put('/:id/status', protect, updateHelpStatus);

module.exports = router;
