// routes/moodRoutes.js

const express = require('express');
const moodController = require('../controllers/moodController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.get('/:mood/recommend', requireAuth, moodController.recommendSongs);

module.exports = router;
