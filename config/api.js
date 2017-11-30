let apiai = require('apiai');
// read the api.ai docs : https://api.ai/docs/

//Enter your API Key
let app = apiai("3fb64ef9693648b196f5dc1f81a11bcb");

let sessionID;
let sendID = (id) => {
    sessionID = id;
};

// Function which returns speech from api.ai
let getRes = function(query) {
    let request = app.textRequest(query, {
        sessionId: sessionID
    });
    const responseFromAPI = new Promise(
        function (resolve, reject) {
            request.on('error', function(error) {
                reject(error);
            });
            request.on('response', function(response) {
                let generator;
                generator = {action : response.result.action , message : response.result.fulfillment.speech};
                resolve(generator);
            });
        });
    request.end();
    return responseFromAPI;
};

// test the command :
//getRes('hello').then(function(res){console.log(res)});

module.exports = {getRes, sendID};