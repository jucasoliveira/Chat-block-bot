// let app = require('express')();

// let swarm = require('./etherumSwarmNode');
let api = require('./api');
let ipfs = require('./handlefiles');
let funct = require('./function');

let http= require('http');
let https = require('https');
let fs = require('fs');
let io;

let options = {
    key: fs.readFileSync('./config/certs/server/myserver.key'),
    cert: fs.readFileSync('./config/certs/server/pure-ridge-42982_herokuapp_com.crt'),
    requestCert: false,
    rejectUnauthorized: false
};


// let server = https.createServer(options, app);
//let server = http.createServer(app);

// let io = require('socket.io')(server);
// io.set("transports", ["xhr-polling","websocket","polling", "htmlfile"]);

let conn = function(server) {

    /*
    server.listen(8000, function(){
        console.log('listening on *:8000');
    });

    app.get('/', function (req, res) {
        res.set('Content-Type', 'text/xml; charset=utf-8');
        res.sendfile(__dirname + '/index.html');
    });

    */
};

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
};
module.exports = {conn,fromClient};