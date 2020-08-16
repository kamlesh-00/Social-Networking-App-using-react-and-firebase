const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();

admin.initializeApp();

const firebaseConfig = {
    apiKey: "AIzaSyAXEhxTCIsRw0E8BhGWsFoqeqoLGQaOT58",
    authDomain: "socialape-7dafe.firebaseapp.com",
    databaseURL: "https://socialape-7dafe.firebaseio.com",
    projectId: "socialape-7dafe",
    storageBucket: "socialape-7dafe.appspot.com",
    messagingSenderId: "36129473466",
    appId: "1:36129473466:web:2b2532b74bff0198fe1383",
    measurementId: "G-VRJXSDBL0L"
};

const firebase = require('firebase');
const { user } = require('firebase-functions/lib/providers/auth');
firebase.initializeApp(firebaseConfig);

const db = admin.firestore();

app.get('/screams',(req,res)=>{
    db.collection('screams')
        .orderBy('createdAt','desc')
        .get()
        .then(data=>{
            let screams = [];
            data.forEach(doc=>{
                screams.push({
                    screamId: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    // createdAt: doc.data().createdAt,
                    // commentCount: doc.data().commentCount,
                    // likeCount: doc.data().likeCount()
                })
            });
            return res.json(screams)
        })
        .catch(err=>console.log(err));
});

app.post('/addScream',(req,res)=>{
    if(req.method!=='POST'){
        return res.status(400).json({err:'Method not allowed'});
    }
    const newScream = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: new Date().toISOString()
    };
    db.collection('screams').add(newScream)
    .then(doc=>{
        return res.json({message:`document ${doc.id} created successfully.`})
    })
    .catch(err=>{
        res.status(500).json({error:`Something went wrong.`});
        console.log(err);
    });
});

//Signup route
app.post('/signup',(req,res)=>{
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    };

    db.doc(`/users/${newUser.handle}`).get()
    .then(doc=>{
        if(doc.exists){
            return res.status(400).json({handle: "This handle is already taken"})
        }else{
            firebase.auth().createUserWithEmailAndPassword(newUser.email,newUser.password);
        }
    })
    .then(data=>{
        return data.user.getIdToken();
    })
    .then(token=>{
        return res.status(201).json({token});
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err.code});
    });
});

exports.api = functions.regios('europe-west1').https.onRequest(app);