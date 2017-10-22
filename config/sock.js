let app = require('express')();
let server = require('http').Server(app);
let io = require('socket.io')(server);

let api = require('./api');

let conn = function() {
    server.listen(8010);

    app.get('/', function (req, res) {
        res.sendfile(__dirname + '/index.html');
    });
};

let fromClient = function() {

    io.on('connection', function (socket) {
        socket.on('fromClient', function (data) {
            api.getRes(data.client).then(function(res){
                socket.emit('fromServer', { server: res.message, treat: res.action });
            });
        });
    });
};

module.exports = {conn,fromClient};