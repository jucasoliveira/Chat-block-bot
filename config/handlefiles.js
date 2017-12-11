
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
    /* Future implementation
    ipfs.files.cat(ipfsHash, function(err, res) {
        if (err || !res) return callback(err, null);

        let gotIpfsData = function (ipfsData) {
            callback(err, ipfsData);
        };

        let concatStream = concat(gotIpfsData);

        if(res.readable) {
            // Returned as a stream
            res.pipe(concatStream);
        } else {

            if (!ipfs.api.Buffer.isBuffer(res)) {

                if (typeof res === 'object')
                    res = JSON.stringify(res);

                if (typeof res !== 'string')
                    throw new Error("ipfs.cat response type not recognized; expecting string, buffer, or object");

                res = new ipfs.api.Buffer(res, 'binary');
            }

            // Returned as a string
            callback(err, res);
        }
    });
    */
};

module.exports = {
    ipfsAdd,
    ipfsGet
};

