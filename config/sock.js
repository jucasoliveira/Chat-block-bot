// let app = require('express')();

// let swarm = require('./etherumSwarmNode');
let api = require('./api');
let ipfs = require('./handlefiles');
let funct = require('./function');
let io;


let fromClient = function(server) {

    io = require('socket.io')(server);

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
                        socket.emit('updateList', { 'return': true });
                    }
                });
        })
    });
    io.on('connection', function (socket) {
        socket.on('removeFile', function (hash) {
            console.log('on removeFile');
            ipfs.ipfsRemove(hash,(d)=>{
                socket.emit('imageRemoved', d);
                console.log(d);
            });
        })
    });
};
module.exports = {fromClient};