// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID' 		: '128397204540271', // your App ID
        'clientSecret' 	: '7056337b78c7edf621a208f883358167', // your App Secret
        'callbackURL' 	: 'https://localhost:3000/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey' 		: 'your-consumer-key-here',
        'consumerSecret' 	: 'your-client-secret-here',
        'callbackURL' 		: 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID' 		: 'your-secret-clientID-here',
        'clientSecret' 	: 'your-client-secret-here',
        'callbackURL' 	: 'http://localhost:8080/auth/google/callback'
    }

};