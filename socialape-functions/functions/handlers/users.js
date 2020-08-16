const {db} = require('../utils/admin');

const {firebaseConfig} = require('../utils/config');

const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);

const isEmpty = (string)=>{
    if (string==='') return true;
    else return false;
}
const isEmail = (string)=>{
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(string).toLowerCase());
}

exports.signUp = (req,res)=>{
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
}

exports.login = (req,res)=>{
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
}