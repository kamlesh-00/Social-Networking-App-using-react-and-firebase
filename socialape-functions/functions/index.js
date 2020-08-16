const functions = require('firebase-functions');
const app = require('express')();

const {getAllScreams,postOneScream} = require('./handlers/screams');
const {signUp, login, uploadImage, addUserDetails} = require('./handlers/users');
const {fbAuth} = require('./utils/fbAuth');

// Scream routes
app.get('/screams',getAllScreams);
app.post('/addScream',fbAuth,postOneScream);

// Users routes
app.post('/signup',signUp);
app.post('/login',login);
app.post('/user/image',fbAuth,uploadImage);
app.post('/user',fbAuth,addUserDetails);

exports.api = functions.region('europe-west1').https.onRequest(app);