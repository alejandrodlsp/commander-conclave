const { Server } = require('socket.io');
const jwt = require("jsonwebtoken")

const http = require('http');
const server = http.createServer();

const roomCable = require('./room.cable.js')

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:8080',
        allowedHeaders: ['authorization'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    },
    allowEIO3: true
});

io.engine.use((req, res, next) => {
    const isHandshake = req._query.sid === undefined;
    if (!isHandshake) {
        return next();
    }

    const header = req.headers["authorization"];
    
    if (!header) {
        return next(new Error("no token"));
    }
    
    if (!header.startsWith("bearer ")) {
        return next(new Error("invalid token"));
    }
    
    const token = header.substring(7);
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return next(new Error("invalid token"));
        }
        req.user = decoded;
        next();
    });
});

io.on('connection', (socket) => {
    onConnect(socket)

    socket.on('disconnect', () => {
        onDisconnect(socket)
    });

    socket.on('TS_ATTEMPT_JOIN_ROOM', (room) => {
        roomCable.attemptJoinRoom(io, socket, room)
    })
});

const onConnect = (socket) => {
    const userId = socket.request.user.id;
    socket.join(`user:${userId}`);    
}

const onDisconnect = (socket) => {
    const userId = socket.request.user.id;
    socket.leave(`user:${userId}`);   
}

server.listen(3001, () => {
    console.log("Socket is running")
})