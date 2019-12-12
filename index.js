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

const sendMessage = function(socket,dataObject){
    db.query(
        'INSERT talk_logs VALUE(null, ?, ?, ?, ?);',
        Object.values( dataObject ),
        error => {
            if(error){
                socket.emit('notice',error);
                throw error;
            }
        }
    );
};

io.sockets.on('connection', function(socket) {
    const notice = v=>{socket.emit('notice',v)};

    socket.emit('getCurrentRoom');

    notice('websocketに接続した');

    socket.on('moveRooms', function(roomId){
        moveRooms(this,roomId);
    });
    socket.on('rooms', function(){
        notice(socket.rooms);
    });
    socket.on('sendMessage', function(dataObject){
        sendMessage(this,dataObject)
    });
});

server.listen(8080);
