let app = require('express')();
let server = require('http').Server(app);
let io = require('socket.io')(server);
// let swarm = require('./etherumSwarmNode');
let api = require('./api');
let ipfs = require('./handlefiles');
let funct = require('./function');
let dashboard = require('../routes/dashboard');


let conn = function() {
    server.listen(5000);

    app.get('/', function (req, res) {
        res.sendfile(__dirname + '/index.html');
        console.log(req);
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
    io.on('connection', function (socket) {
        socket.on('toSwarm', function (res) {
            ipfs.ipfsAdd(res,(d)=>{
                socket.emit('toSendHash', d[0].Hash)
            });
        });
    });
    io.on('connection', function (socket) {
        socket.on('retrieveImage', function (hash) {
            ipfs.ipfsGet(hash,(d)=>{
                socket.emit('image', d)
            });
        })
    });
    io.on('connection', function (socket) {
        socket.on('saveList', function (list) {
            /*
            ipfs.ipfsGet(hash,(d)=>{
                socket.emit('image', d)
            });
            */
            funct.userList(list.user, list.hash, list.name)
                .then(function(result){
                    if (result) {
                        console.log('updating list');
                        socket.emit('updateList', { 'return': true });
                    }
                });
        })
    });
};
module.exports = {conn,fromClient};