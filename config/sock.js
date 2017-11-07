let app = require('express')();
let server = require('http').Server(app);
let io = require('socket.io')(server);
let swarm = require('./etherumSwarmNode');
let api = require('./api');
let ipfs = require('./handlefiles');

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
        socket.on('toSwarm', function (res) {
            console.log(res);
            ipfs.ipfsAdd(res,(d)=>{
                socket.emit('toSendHash', d[0].Hash)
            });
        });
        socket.on('retrieveImage', function (hash) {
            console.log(hash);
            ipfs.ipfsGet(hash,(d)=>{
                socket.emit('image', d)
            });
        })
    });
};

module.exports = {conn,fromClient};