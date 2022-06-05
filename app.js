require('dotenv').config();

const express = require('express');
const res = require('express/lib/response')
const hbs = require('hbs');
const async = require('hbs/lib/async');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
    
// Our routes go here:
app.get('/', (req, res)=> {
    res.render('index');
})

app.get("/artist-search", async (req, res)=>{
  const { artist } = req.query;
  spotifyApi
  .searchArtists(`${artist}`)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render('artist-search-results', data.body.artists)
  })
  .catch(err => console.log('Erro0o0o0r', err));
})

app.get('/albums/:id',  (req, res) => {
  // .getArtistAlbums() code goes here
  spotifyApi
  .getArtistAlbums(req.params.id)
  .then(data => {
    console.log(data.body);
    res.render('albums', data.body)
  })
  .catch(err=> console.log ("The error is....", err))
})

app.get('/tracks/:id', (req, res) => {
  const { id } = req.params;
  spotifyApi
      .getAlbumTracks(id)
      .then(data => {
          res.render('tracks', data.body)
      })
      .catch(err => console.log('audio error', err))
})



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
