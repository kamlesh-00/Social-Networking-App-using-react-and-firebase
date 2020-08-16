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
                    createdAt: doc.data().createdAt,
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
        console.log(err);
        return res.status(500).json({error:`Something went wrong.`});
    });
});

const isEmpty = (string)=>{
    if (string==='') return true;
    else return false;
}
const isEmail = (string)=>{
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(string).toLowerCase());
}

//TODo Validate route
app.post('/signup',(req,res)=>{
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    };

    //Validation
    let errors = {};
    if(isEmpty(newUser.email)) errors.email = 'Email must not be empty';
    else if(!isEmail(newUser.email)) errors.email = 'Must be a valid email address';
    
    if(isEmpty(newUser.password)) errors.password = 'Password must not be empty';

    if(newUser.password !== newUser.confirmPassword) errors.confirmPassword = 'Passwords must match';
    
    if(isEmpty(newUser.handle)) errors.handle = 'Handle must not be empty';

    if(Object.keys(errors).length>0) return res.status(400).json({errors: errors});

    let token,userId;
    db.doc(`/users/${newUser.handle}`).get()
    .then(doc=>{
        if(doc.exists){
            return res.status(400).json({handle: "This handle is already taken"})
        }else{
            return firebase.auth().createUserWithEmailAndPassword(newUser.email,newUser.password);
        }
    })
    .then(data=>{
        userId = data.user.uid;
        return data.user.getIdToken();
    })
    .then(idToken=>{
        token = idToken;
        const userCredentials = {
            handle: newUser.handle,
            email: newUser.email,
            createdAt: new Date().toISOString(),
            userId: userId
        };
        return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(()=>{
        return res.status(201).json({token});
    })
    .catch(err=>{
        console.log(err);
        if(err.code==='auth/email-already-in-use'){
            res.status(400).json({error:'Email is already in use'});
        }else{
            res.status(500).json({error:err.code});
        }
    });
});

exports.api = functions.region('europe-west1').https.onRequest(app);