const express = require('express');

const {
  getUserGoals,
  updateUserGoals
} = require('../controllers/goalsController');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getUserGoals);
router.put('/', updateUserGoals);

module.exports = router;