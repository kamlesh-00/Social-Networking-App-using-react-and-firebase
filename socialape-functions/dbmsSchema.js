//Just a general practive and wont be using it at any where

let db = {
    screams: [{
        userHandle: 'user',
        body: 'Scream: ahhhhhhh',
        createdAt: "2020-08-15T09:03:44.019Z",
        likeCount: 5,
        commentCount: 2
    }],
    users: [{
        handle: 'user',
        email: 'user@email.com',
        createdAt: "2020-08-16T12:09:38.127Z",
        imageURL: "https://firebasestorage.googleapis.com/v0/b/socialape-7dafe.appspot.com/o/168723.jpg?alt=media",
        userId: "5U6qrAqxfNYSXs6xFxKG3nEZch92",
        bio: 'Hello, my name is User.',
        website: 'www.example.com',
        location: 'Mumbai/India'
    }],
    comments: [{
        userHandle: 'user',
        screamId: '6asfasdagfsegr62f4g51f',
        body: 'Nice one mate!',
        createdAt: '2020-08-16T12:09:38.127Z'
    }],
    notification: [{
        recipient: 'user',
        sender: 'john',
        read: true | false,
        screamId: 'kQo4GIAFohRXWU0RJgqR',
        type: 'like | comment',
        createdAt: '2020-08-16T12:09:38.127Z'
    }]
};
const userDetails = {
    //Redux Data
    credentials: {
        handle: 'user',
        email: 'user@email.com',
        createdAt: "2020-08-16T12:09:38.127Z",
        imageURL: "https://firebasestorage.googleapis.com/v0/b/socialape-7dafe.appspot.com/o/168723.jpg?alt=media",
        userId: "5U6qrAqxfNYSXs6xFxKG3nEZch92",
        bio: 'Hello, my name is User.',
        website: 'www.example.com',
        location: 'Mumbai/India'
    },
    likes: [{
            userHandle: 'user',
            screamId: 'hhLasfajsbdjasda'
        },
        {
            userHandle: 'user',
            screamId: 'ssdfhbasbadsdasd64sd'
        }
    ]
}