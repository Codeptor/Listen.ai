// controllers/moodController.js

const Mood = require('../models/mood');

const recommendSongs = async (req, res) => {
  const { mood } = req.params;

  try {
    const songs = await Mood.findOne({ name: mood }).populate('songs');
    if (!songs) {
      return res.status(404).json({ error: 'Mood not found' });
    }

    res.json({ songs: songs.songs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  recommendSongs
};
