import spotipy
import spotipy.util as util

# Authenticate with Spotify API using the provided client ID and secret
client_id = 'your_client_id'
client_secret = 'your_client_secret'
redirect_uri = 'your_redirect_uri'
username = 'your_username'
scope = 'user-library-read playlist-read-private playlist-modify-private'

token = util.prompt_for_user_token(username, scope, client_id, client_secret, redirect_uri)
sp = spotipy.Spotify(auth=token)

# Get the mood from the user
mood = input("Enter your mood (e.g. happy, sad, energetic): ")

# Use Spotify's recommendation API to get a list of songs based on the mood
tracks = sp.recommendations(seed_genres=[mood])

# Get the first song from the list of recommended tracks
song = tracks['tracks'][0]['name']

# Add the song to a playlist
playlist_id = 'your_playlist_id'
sp.user_playlist_add_tracks(username, playlist_id, [song['id']])

print("Song added to playlist:", song)
## spotify api se connect karke write the client id
