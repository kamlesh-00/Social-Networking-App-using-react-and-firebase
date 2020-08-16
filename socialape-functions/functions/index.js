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

const FBAuth = (req,res,next)=>{
    let idToken;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        idToken = req.headers.authorization.split('Bearer ')[1];
    }else{
        console.log('No token found');
        return res.status(403).json({Error:'Unauthorized'});
    }
    admin.auth().verifyIdToken(idToken)
    .then(decodedToken=>{
        req.user = decodedToken;
        console.log(decodedToken);
        return db.collection('users').where('userId','==',req.user.uid)
        .limit(1).get();
    })
    .then(data=>{
        req.user.handle = data.docs[0].data().handle;
        return next();
    })
    .catch(err=>{
        console.error('Error while verifying token', err);
        return res.status(403).json(err);
    })
}

app.post('/addScream',FBAuth,(req,res)=>{
    if(req.body.body.trim() === ''){
        return res.status(400).json({body:'Body must not be empty'});
    }
    const newScream = {
        body: req.body.body,
        userHandle: req.user.handle,
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

app.post('/login',(req,res)=>{
    const user = {
        email: req.body.email,
        password: req.body.password
    };
    
    let errors = {};
    if(isEmpty(user.email)) errors.email = 'Email must not be empty';
    else if(!isEmail(user.email)) errors.email = 'Must be a valid email address';
    
    if(isEmpty(user.password)) errors.password = 'Password must not be empty';

    if(Object.keys(errors).length>0) return res.status(400).json({errors: errors});


    firebase.auth().signInWithEmailAndPassword(user.email,user.password)
    .then(data=>{
        return data.user.getIdToken();
    })
    .then(token=>{
        res.json({token});
    })
    .catch(err=>{
        console.log(err);
        if(err.code==='auth/wrong-password') res.status(403).json({general: 'Wrong credentials, please try again.'})
        else res.status(500).json({error: err.code});
    });
});

exports.api = functions.region('europe-west1').https.onRequest(app);