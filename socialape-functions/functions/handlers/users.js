const {db,admin} = require('../utils/admin');

const {firebaseConfig} = require('../utils/config');

const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);

const {validateSignUpData, validateLoginData, reduceUserDetails} = require('../utils/validators');

exports.signUp = (req,res)=>{
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    };

    const {valid,errors} = validateSignUpData(newUser);
    if(!valid) return res.status(400).json(errors);

    const noImage = 'facebook-no-image.png';

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
            imageURL: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${noImage}?alt=media`,
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
    
    const {valid,errors} = validateLoginData(user);
    if(!valid) return res.status(400).json(errors);

    firebase.auth().signInWithEmailAndPassword(user.email,user.password)
    .then(data=>{
        return data.user.getIdToken();
    })
    .then(token=>{
        return res.json({token});
    })
    .catch(err=>{
        console.log(err);
        if(err.code==='auth/wrong-password') res.status(403).json({general: 'Wrong credentials, please try again.'})
        else res.status(500).json({error: err.code});
    });
}

exports.addUserDetails = (req,res)=>{
    let userDetails = reduceUserDetails(req.body);

    db.doc(`/users/${req.user.handle}`).update(userDetails)
    .then(()=>{
        return res.json({message: 'Details added successfully'});
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error: err.code});
    });
}

exports.getAuthenticatedUser = (req,res)=>{
    let userData = {};
    db.doc(`/users/${req.user.handle}`).get()
        .then(doc=>{
            if(doc.exists){
                userData.credentials = doc.data();
                return db.collection('likes').where('userHandle','==',req.user.handle).get()
            }
        })
        .then(data=>{
            userData.likes = []
            data.forEach(doc=>{
                userData.likes.push(doc.data());
            });
            return res.json(userData);
        })
        .catch(err=>{
            console.log(err);
            return res.status(500).json({error: err.code});
        });
};

exports.uploadImage = (req,res)=>{
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');

    let imageFileName;
    let imageToBeUploaded = {};

    const busboy = new BusBoy({headers: req.headers});
    busboy.on('file',(fieldname,file,filename,encoding,mimetype)=>{
        if(mimetype!=='image/jpeg' && mimetype!=='png/jpeg'){
            return res.status(400).json({error:"Wrong file type submitted"});
        }
        // image.png
        const imageExtension = filename.split('.')[filename.split('.').length-1];
        // 546548465487.png
        imageFileName = `${Math.round(Math.random()*1000000)}.${imageExtension}`;
        const filepath = path.join(os.tmpdir(), imageFileName)
        imageToBeUploaded = {filepath,mimetype};
        file.pipe(fs.createWriteStream(filepath));
    });
    busboy.on('finish',()=>{
        admin.storage().bucket().upload(imageToBeUploaded.filepath,{
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimetype
                }
            }
        })
        .then(()=>{
            const imageURL = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;
            return db.doc(`/users/${req.user.handle}`).update({imageURL: imageURL});
        })
        .then(()=>{
            return res.json({message: "Image uploaded successfully."});
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({error: err.code});
        });
    });
    busboy.end(req.rawBody);
}