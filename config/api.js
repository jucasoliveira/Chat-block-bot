let apiai = require('apiai');
let app = apiai("3fb64ef9693648b196f5dc1f81a11bcb");

// Function which returns speech from api.ai
let getRes = function(query) {
    let request = app.textRequest(query, {
        sessionId: '<unique session id>'
});
    const responseFromAPI = new Promise(
        function (resolve, reject) {
            request.on('error', function(error) {
                reject(error);
            });
            request.on('response', function(response) {
                resolve(response.result.fulfillment.speech);
            });
        });
    request.end();
    return responseFromAPI;
};

// test the command :
//getRes("hello").then(function(res){console.log(res)});

module.exports = {getRes};