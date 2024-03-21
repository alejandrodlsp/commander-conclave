const { Server } = require('socket.io');
const jwt = require("jsonwebtoken")

const http = require('http');
const server = http.createServer();

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

    socket.on('TS_JOIN_ROOM', (room) => {
        onJoinRoom(socket, room)
    })
});

const onConnect = (socket) => {
    const userId = socket.request.user.id;
    socket.join(`user:${userId}`);    

    socket.emit("TC_USER_CONNECTED", userId)
}

const onDisconnect = (socket) => {
    const userId = socket.request.user.id;

    socket.emit("TC_USER_DISCONNECTED", userId)
    socket.leave(`user:${userId}`);
}

const onRoomMessage = (socket, room, msg) => {
    const user = socket.request.user
    const userData = {
        id: user.id,
        username: user.username
    }
    const messageData = {
        user: userData,
        message: msg,
        time: new Date().toLocaleTimeString()
    }
    socket.to(room).emit("TC_CHAT_MESSAGE", messageData)
}

const onLeaveRoom = (socket, room) => {
    socket.leave(room)

    // Clear room listeners
    socket.removeAllListeners('TS_CHAT_MESSAGE', onRoomMessage)
    socket.removeAllListeners('TS_LEAVE_ROOM', onLeaveRoom)

    socket.to(room).emit("TC_USER_LEFT_ROOM", socket.request.user)
}

const onJoinRoom = (socket, room) => {
    // Check last room, and leave if it exists
    if (socket.currentRoom) {
        socket.leave(socket.currentRoom);
        socket.currentRoom = null;
    }
    socket.join(room);
    socket.currentRoom = room;

    // Register room listeners
    socket.on('TS_CHAT_MESSAGE', (msg) => {
        onRoomMessage(socket, room, msg);
    });

    socket.on('TS_LEAVE_ROOM', () => {
        onLeaveRoom(socket, room);
    });
    
    // Emit user joined room messages
    socket.to(room).emit("TC_USER_JOINED_ROOM", socket.request.user)
}


server.listen(3001, () => {
    console.log("Socket is running")
})