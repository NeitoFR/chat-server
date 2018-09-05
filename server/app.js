"use strict"
//require
require('dotenv').config();
var moment = require('moment'),
    http = require('http'),
    server = http.createServer().listen(process.env.APP_PORT, function () { console.log('Server listening on port : ' + process.env.APP_PORT) }),
    io = require('socket.io').listen(server);

var users = [];

io.sockets.on('connection', function (socket) {
    console.log('Un client est connecté !');
    socket.on('username', function (message) {
        socket.username = message.username;
        users.push({ username: socket.username });
        _sendUserList();
    })
    socket.on('new-message', function (message) {
        message.timestamp = moment(message.timestamp).format('HH:mm:ss');
        io.emit('message2all', message);
    });
});

io.sockets.on('connect_timeout', function (message) {
    console.log('**** Timed OUT ', message);
});

function _sendUserList() {
    io.emit('userlist', users);
}