const express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

console.log(__dirname);
app.use('/public', express.static(__dirname + '/public', {

}));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

var users = []
io.on('connection', function (socket) {
    // users.push({ id: socket.id })
    socket.on('disconnect', () => {
        users = users.filter(u => u.id !== socket.id);
        io.emit('updateUserList', users);
    });
    socket.on('login', (name) => {
        const user = users.filter(user => user.name === name && user.id !== socket.id);
        isUserExist = user.length;
        debugger;
        io.to(socket.id).emit('loginStatus', !isUserExist)
        if (!isUserExist) {
            users.push({
                id: socket.id,
                name: name
            })
        }
        io.emit('updateUserList', users);
    });
    socket.on('offer', (data) => {
        const { to, offer, name } = data;
        console.log("[SERVER] sending offer to" + name)

        io.to(to).emit('offer', {
            offer: offer,
            fromuser: {
                name: users.find(user => user.id === socket.id).name,
                id: socket.id
            }
        })
    });
    socket.on('answer', (data) => {
        const { to, answer } = data;
        io.to(to).emit('answer', {
            answer: answer,
            fromuser: {
                id: socket.id
            }
        })
    })
    socket.on('candidate', (data) => {
        const { to, candidate, name } = data;
        io.to(to).emit('candidate', {
            candidate: candidate,
            fromuser: {
                name: name,
                id: socket.id
            }
        })
    })
});

http.listen(8080, function () {
    console.log('listening on *:8080');
});