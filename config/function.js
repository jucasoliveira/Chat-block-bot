let bcrypt = require('bcryptjs'),
    Q = require('q'),
    config = require('./loginConfig'); //config file contains all tokens and other private info
// MongoDB connection information
// let mongodbUrl = 'mongodb://localhost:27017/myproject';
// let mongodbUrl = 'mongodb://mongo:27017';
let mongodbUrl = 'mongodb://bancoCluster01:zVvQhfqZFvqnaoeI@cluster0-shard-00-00-fibm5.mongodb.net:27017,cluster0-shard-00-01-fibm5.mongodb.net:27017,cluster0-shard-00-02-fibm5.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin'
let MongoClient = require('mongodb').MongoClient;

//used in local-signup strategy
let localReg = function (username, password) {
    let deferred = Q.defer();

    MongoClient.connect(mongodbUrl, function (err, db) {
        let collection = db.collection('localUsers');

        //check if username is already assigned in our database
        collection.findOne({'username' : username})
            .then(function (result) {
                if (null !== result) {
                    console.log("USERNAME ALREADY EXISTS:", result.username);
                    deferred.resolve(false); // username exists
                }
                else  {
                    let hash = bcrypt.hashSync(password, 8);
                    let user = {
                        "username": username,
                        "password": hash,
                        "avatar": "http://placepuppy.it/images/homepage/Beagle_puppy_6_weeks.JPG",
                        "filelist" : []
                    };

                    console.log("CREATING USER:", username);

                    collection.insert(user)
                        .then(function () {
                            db.close();
                            deferred.resolve(user);
                        });
                }
            });
    });

    return deferred.promise;
};


/**check if user exists
 *if user exists check if passwords match (use bcrypt.compareSync(password, hash); // true where 'hash' is password in DB)
 *if password matches take into website
 *if user doesn't exist or password doesn't match tell them it failed
 **/

let localAuth = function (username, password) {
    let deferred = Q.defer();

    MongoClient.connect(mongodbUrl, function (err, db) {
        let collection = db.collection('localUsers');

        collection.findOne({'username' : username})
            .then(function (result) {
                if (null === result) {
                    console.log("USERNAME NOT FOUND:", username);

                    deferred.resolve(false);
                }
                else {
                    let hash = result.password;

                    console.log("FOUND USER: " + result.username);

                    if (bcrypt.compareSync(password, hash)) {
                        deferred.resolve(result);
                    } else {
                        console.log("AUTHENTICATION FAILED");
                        deferred.resolve(false);
                    }
                }

                db.close();
            });
    });

    return deferred.promise;
};

let userList = function(username, hash, filename){
    let deferred = Q.defer();

    MongoClient.connect(mongodbUrl, function (err, db) {
        let collection = db.collection('localUsers');
        collection.update(
            {"username": username},
            {$push:
                {"filelist":
                    {"name": filename, "hash" : hash}
                }
            }).then( function (result) {
                if(null === result){
                    console.log('FILE DIDNT UPLOADED');
                    deferred.resolve(false);
                } else {
                    deferred.resolve(true);
                }
            db.close()
        });

    });
    return deferred.promise;
};

module.exports = {
    localReg,
    localAuth,
    userList
};