
/**
 * this is to get the up gateway
 * @type {Bzz}
 */

let ipfs = require('ipfs-js');
let concat = require('concat');

ipfs.setProvider(require('ipfs-api')('localhost', '5001'));


let ipfsAdd = (buf, cb) =>{
    ipfs.api.add(buf, function(err, hash) {
        if (err) throw err;
        cb(hash);
        console.log(hash); 	// "Qmc7CrwGJvRyCYZZU64aPawPj7CJ56vyBxdhxa38Dh1aKt"
    });
};

let ipfsGet = (ipfsHash, callback) => {
    ipfs.api.cat(ipfsHash, function (err, file) {
        if (err || !file) return callback(err, null);
        if(file){
            let gotIpfsData = function (ipfsData) {
                callback(err, ipfsData);
            };

            let concatStream = concat(gotIpfsData);

            file.pipe(concatStream);
        }
    })
};

module.exports = {
    ipfsAdd,
    ipfsGet
};

