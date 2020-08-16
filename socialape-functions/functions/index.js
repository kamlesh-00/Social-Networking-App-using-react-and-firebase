const functions = require('firebase-functions');
const app = require('express')();

const {admin,db} = require('./utils/admin');
const {getAllScreams,postOneScream} = require('./handlers/screams');
const {signUp, login} = require('./handlers/users');

app.get('/screams',getAllScreams);

const {fbAuth} = require('./utils/fbAuth')

app.post('/addScream',fbAuth,postOneScream);

app.post('/signup',signUp);

app.post('/login',login);

exports.api = functions.region('europe-west1').https.onRequest(app);