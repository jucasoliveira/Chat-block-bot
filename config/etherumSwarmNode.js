
// Etherum Address: {2cf35e50fbab6861051790bfebc89909cb3f22c6}

//
// Needs web3.js from https://github.com/axic/web3.js/tree/swarm
//

let Web3 = require('web3');

let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8500'));
try {
    web3.eth.defaultAccount = web3.eth.coinbase
} catch (e) {
}

web3.bzz.setProvider("http://localhost:8500");

let dir = {
    "./foo.txt": {type: "text/plain"}
};

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

/*
swarmPut(dir, function (res) {

    console.log('Added to swarm: ', res);

    swarmGet(res, function (res1) {
        console.log('Retrieved from swarm: ', res1);
    })
});
*/
module.exports = {
    swarmPut,
    swarmGet
};