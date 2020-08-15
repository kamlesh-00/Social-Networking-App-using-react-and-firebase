const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
exports.helloworld = functions.https.onRequest((req,res)=>{
    res.send('Hello World!');
});

exports.getScream = functions.https.onRequest((req,res)=>{
    admin.firestore().collection('screams').get()
        .then(data=>{
            let screams = [];
            data.forEach(doc=>{
                screams.push(doc.data())
            });
            return res.json(screams)
        })
        .catch(err=>console.log(err));
});

exports.createScream = functions.https.onRequest((req,res)=>{
    if(req.method!=='POST'){
        return res.status(400).json({err:'Method not allowed'});
    }
    const newScream = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: admin.firestore.Timestamp.fromDate(new Date())
    };
    admin.firestore().collection('screams').add(newScream)
    .then(doc=>{
        return res.json({message:`document ${doc.id} created successfully.`})
    })
    .catch(err=>{
        res.status(500).json({error:`Something went wrong.`});
        console.log("Error: "+err);
    });
})