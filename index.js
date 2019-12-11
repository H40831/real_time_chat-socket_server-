require('dotenv').config();
const fs = require('fs');
const http = require('http');
const server = http.createServer();
const db = require('mysql').createConnection({
    host: 'my-rds.c7rekwisb6xy.ap-northeast-1.rds.amazonaws.com',
    database: 'real_time_chat',
    charset: 'utf8mb4',
    user: process.env.DB_ID,
    password: process.env.DB_PW,
});
db.connect();

server.on('request', function(req, res) {
    res.end();
});
const io = require('socket.io').listen(server);

const moveRooms = function(socket,roomId){
    const rooms = ()=> socket.rooms;
    for( let room in rooms() ){
        if( room === roomId ){
            continue;
        }
        socket.leave( room );
    }
    socket.join(roomId);
};

const sendMessage = function(socket,name,message){
    console.log('test');
};

io.sockets.on('connection', function(socket) {
    socket.on('moveRooms', function(roomId){
        moveRooms(this,roomId);
    });
    socket.on('rooms', function(){
        socket.emit('notification', socket.rooms);
    });
});

server.listen(8080);
