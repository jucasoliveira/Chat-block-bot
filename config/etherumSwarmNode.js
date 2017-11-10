
// Etherum Address: {2cf35e50fbab6861051790bfebc89909cb3f22c6}

//
// Needs web3.js from https://github.com/axic/web3.js/tree/swarm
//

/**
 * this is to get the up gateway
 * @type {Bzz}
 */
/*
let Web3 = require('web3');

var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8500'));

try {
    web3.eth.defaultAccount = web3.eth.coinbase
} catch (e) {
}


web3.bzz.setProvider('http://localhost:8500');

console.log(web3.eth.defaultAccount);

web3.bzz.upload("hello").then(console.log);

let swarmPut = function (buf, cb) {

    web3.bzz.upload(buf).then(function (hash) {
        console.log("Uploaded file : ", hash);
        cb(hash);
    });

};

let swarmGet = function (key, cb) {
    web3.bzz.download(key).then(function(buffer) {
        console.log("Retrieved file : ", buffer);
        cb(buffer)
    });
};

let swarmPick = function(cb){
    console.log('merda');
};


module.exports = {
    swarmPut,
    swarmGet,
    swarmPick
};
*/