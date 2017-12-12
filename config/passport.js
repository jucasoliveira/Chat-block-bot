// config/passport.js

// load all the things we need
let LocalStrategy   = require('passport-local').Strategy;
let FacebookStrategy = require('passport-facebook').Strategy;

// load up the user model
// let User       		= require('../app/models/user');

// load the auth variables
let configAuth = require('./auth');
let funct = require('./function.js');

// expose this function to our app using module.exports
module.exports = function(passport) {


    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        console.log("serializing " + user.username);
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        console.log("deserializing " + obj);
        done(null, obj);
    });


    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

// Use the LocalStrategy within Passport to login users.
    passport.use('local-signin', new LocalStrategy(
        {passReqToCallback : true}, //allows us to pass back the request to the callback
        function(req, username, password, done) {
            console.log('here');
            funct.localAuth(username, password)
                .then(function (user) {
                    if (user) {
                        console.log("LOGGED IN AS: " + user.username);
                        req.session.success = 'You are successfully logged in ' + user.username + '!';
                        done(null, user);
                    }
                    if (!user) {
                        console.log("COULD NOT LOG IN");
                        req.session.error = 'Could not log user in. Please try again.'; //inform user could not log them in
                        done(null, user);
                    }
                })
                .fail(function (err){
                    console.log(err.body);
                });
        }
    ));

    // Use the LocalStrategy within Passport to Register/"signup" users.
    passport.use('local-signup', new LocalStrategy(
        {passReqToCallback : true}, //allows us to pass back the request to the callback
        function(req, username, password, done) {
            funct.localReg(username, password)
                .then(function (user) {
                    if (user) {
                        console.log("REGISTERED: " + user.username);
                        req.session.success = 'You are successfully registered and logged in ' + user.username + '!';
                        done(null, user);
                    }
                    if (!user) {
                        console.log("COULD NOT REGISTER");
                        req.session.error = 'That username is already in use, please try a different one.'; //inform user could not log them in
                        done(null, user);
                    }
                })
                .fail(function (err){
                    console.log(err.body);
                });
        }
    ));

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================

    passport.use(new FacebookStrategy({

            // pull in our app id and secret from our auth.js file
            clientID        : configAuth.facebookAuth.clientID,
            clientSecret    : configAuth.facebookAuth.clientSecret,
            callbackURL     : configAuth.facebookAuth.callbackURL

        },

        // facebook will send back the token and profile
        function(token, refreshToken, profile, done) {

            // asynchronous
            process.nextTick(function() {
                // funct.localAuth()
                // find the user in the database based on their facebook id
                User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);

                    // if the user is found, then log them in
                    if (user) {
                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user found with that facebook id, create them
                        let newUser            = new User();

                        // set all of the facebook information in our user model
                        newUser.facebook.id    = profile.id; // set the users facebook id
                        newUser.facebook.token = token; // we will save the token that facebook provides to the user
                        newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                        newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                        // save our user to the database
                        newUser.save(function(err) {
                            if (err)
                                throw err;

                            // if successful, return the new user
                            return done(null, newUser);
                        });
                    }

                });
            });

        }));


};