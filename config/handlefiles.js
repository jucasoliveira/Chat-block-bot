
/**
 * this is to get the up gateway
 * @type {Bzz}
 */

let ipfs = require('ipfs-js');
let concat = require('concat');
let fs = require('fs');

ipfs.setProvider(require('ipfs-api')('localhost', '5001'));


let ipfsAdd = (buf, cb) =>{
    ipfs.api.add(buf, function(err, hash) {
        if (err) throw err;
        cb(hash);
        console.log(hash); 	// "Qmc7CrwGJvRyCYZZU64aPawPj7CJ56vyBxdhxa38Dh1aKt"
    });
};

let ipfsGet = (ipfsHash, callback) => {
    let ipfPath = '/ipfs/'+ipfsHash;
    let sendReturn;
    ipfs.api.cat(ipfPath, function (err, file) {
        if (err || !file) return callback(err, null);
        if(file){
            let gotIpfsData = function (ipfsData) {
                callback(err, ipfsData);
            };

            // let concatStream = concat(gotIpfsData);
            let type = fs.createWriteStream( './public/tempfile/' + `${ipfsHash}.jpg`);
            file.pipe(type);
            sendReturn = true;
            callback(sendReturn);
        } else {
            sendReturn = false;
            callback(sendReturn);
        }
    })
};

let ipfsRemove = (ipfsHash, callback) => {
    console.log('removing file');
    fs.unlink('./public/tempfile/' + `${ipfsHash}.jpg`, function(err){
        if(err) return console.log(err);
        console.log('file deleted successfully');
        callback(true);
    });
};

module.exports = {
    ipfsAdd,
    ipfsGet,
    ipfsRemove
};

