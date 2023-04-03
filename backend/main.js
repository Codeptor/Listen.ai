const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const SpotifyWebApi = require('spotify-web-api-node');

app.use(cors());
app.use(bodyParser.json());

// Initialize Spotify API client with credentials
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

// Authenticate Spotify API client
spotifyApi.clientCredentialsGrant()
  .then(data => {
    console.log('Spotify API authenticated');
    spotifyApi.setAccessToken(data.body.access_token);
  })
  .catch(err => {
    console.log('Spotify API authentication error:', err);
  });

// Define a list of mood keywords and their corresponding Spotify genres
const moodGenres = {
  happy: ['pop', 'dance', 'hip hop', 'r&b', 'disco', 'reggae', 'latin', 'country', 'funk'],
  sad: ['indie', 'acoustic', 'folk', 'classical', 'jazz', 'blues', 'chill', 'soul'],
  relaxed: ['jazz', 'blues', 'chill'],
  angry: ['metal', 'punk', 'rock', 'hardcore'],
  excited: ['edm', 'house', 'techno'],
  nostalgic: ['indie', 'acoustic', 'folk', 'classical', 'jazz', 'blues', 'chill', 'soul']
};

// Define a function to get a random song from a list of Spotify tracks
const getRandomSong = async (tracks) => {
  const randomIndex = Math.floor(Math.random() * tracks.length);
  const track = tracks[randomIndex];
  const trackFeatures = await spotifyApi.getAudioFeaturesForTrack(track.id);

  return {
    name: track.name,
    artist: track.artists[0].name,
    album: track.album.name,
    uri: track.uri,
    image: track.album.images[0].url,
    tempo: trackFeatures.tempo,
    energy: trackFeatures.energy
  };
};

app.post('/recommend', async (req, res) => {
  const { mood } = req.body;
  const genres = moodGenres[mood] || [];
  const recommendedSongs = [];

  // Search Spotify for tracks matching the mood genres
  for (const genre of genres) {
    const searchResults = await spotifyApi.searchTracks(`genre:"${genre}"`, { limit: 50 });

    // Get a random song from the search results
    if (searchResults.body.tracks.items.length > 0) {
      const song = await getRandomSong(searchResults.body.tracks.items);
      recommendedSongs.push(song);
    }
  }

  res.json({ songs: recommendedSongs });
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
