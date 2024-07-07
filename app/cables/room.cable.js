const db = require("../../models")
const RoomUser = db.RoomUser

const { getRoomUsers, removeRoomIfEmpty, validateAllUsersReady, checkCanJoinRoom, startRoom } = require('../helpers/room.helper')
const { getOrCreateRoomUser, selectDeck } = require('../helpers/room_user.helper')

exports.attemptJoinRoom = async (io, socket, room) => {
    console.log("Attempting to join room " + room)

    // Validate room status & room is not full
    const canJoinRoom = await checkCanJoinRoom(room)
    if (!canJoinRoom) {
        console.log("\nCannot join room, room is either full or not accepting players" + room)
        return socket.emit('TC_CANNOT_JOIN_ROOM')
    }

    if (socket.currentRoom && socket.currentRoom !== room) {
        console.log("\nCannot join room, player already in a room" + room)
        return socket.emit('TC_CANNOT_JOIN_ROOM')
    }
    
    console.log("\nJoined room successfully" + room)
    socket.emit('TC_JOIN_ROOM')
    
    this.onJoinRoom(io, socket, room)
}

exports.onJoinRoom = async (io, socket, room) => {
    socket.join(room);
    socket.currentRoom = room;

    await getOrCreateRoomUser(room, socket.request.user.id).then(user => {
        syncRoom(io, room)

        socket.on('TS_CHAT_MESSAGE', (msg) => {
            onRoomMessage(io, socket, room, msg);
        });

        socket.on('TS_START_ROOM', () => {
            onStartRoom(io, socket, room);
        });

        socket.on('TS_SELECT_DECK', (deck_id) => {
            onSelectDeck(io, socket, room, deck_id)
        })

        socket.on("TS_ATTEMPT_LEAVE_ROOM", () => { 
            onLeaveRoom(io, socket, room);
        })

        socket.on('disconnect', () => {
            onDisconnect(io, socket, room);
        });
    })
}

const onDisconnect = async (io, socket, room) => {
    return new Promise((resolve, reject) => {
        console.log("Attempting to disconnect " + room)

        if(socket.currentRoom !== room) { 
            console.log("User not in room! cannot disconnect " + room)
            reject(); 
        }  // Validate that the socket is in the room

        socket.removeAllListeners('TS_CHAT_MESSAGE')
        socket.removeAllListeners('TS_START_ROOM')
        socket.removeAllListeners('TS_SELECT_DECK')
        socket.removeAllListeners('TS_LEAVE_ROOM')
        socket.removeAllListeners('disconnect')
        socket.leave(room)

        console.log("Socket disconnected " + room)
        resolve(true)
    }).catch(err => reject(err));
}

const onLeaveRoom = async (io, socket, room) => {
    return new Promise((resolve, reject) => {
        console.log("Attempting to leave room " + room)

        if(socket.currentRoom !== room) { 
            console.log("User not in room! cannot leave " + room)
            reject(); 
        }  // Validate that the socket is in the room

        RoomUser.destroy({
            where: { 
                user_id: socket.request.user.id,
                room_id: room
            }
        })

        removeRoomIfEmpty(room)
        
        socket.emit("TS_LEAVE_ROOM")
        socket.to(room).emit("TC_USER_LEAVE_ROOM", socket.request.user)

        onDisconnect(io, socket, room).then(() => {
            console.log("User left room " + room)
            syncRoom(io, room)
            resolve(true)
        }).catch(err => reject(err));
    })
}

const onRoomMessage = (io, socket, room, msg) => {
    console.log("New message received... " + msg)

    if(socket.currentRoom !== room) { 
        console.log("User not in room! cannot send message " + room)
        reject(); 
    }  // Validate that the socket is in the room

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
    console.log("Emiting new message event: " + messageData)
    socket.to(room).emit("TC_CHAT_MESSAGE", messageData)
}

const syncRoom = (io, room) => {
    console.log("\nSyncing room... " + room)
    getRoomUsers(room).then(users => {
        console.log("\nRoom synced " + room)
        io.to(room).emit("TC_SYNC_ROOM", {
            users: users
        })
    }).catch((err) => {
        console.error('Error syncing room:', err);
    })
};

const onSelectDeck = (io, socket, room_id, deck_id) => {
    console.log("Selecting deck... " + deck_id)

    if(socket.currentRoom !== room) { 
        console.log("User not in room! cannot send select deck " + room)
        reject(); 
    }  // Validate that the socket is in the room

    const userId = socket.request.user.id;

    selectDeck(room_id, userId, deck_id).then(() => {
        console.log("Deck selected, emiting to user that deck is loaded: " + deck_id)
        io.to(`user:${userId}`).emit("TC_DECK_LOADED", deck_id)
        syncRoom(io, room_id)
    }).catch((err) => {
        console.error('Error selecting deck:', err)
    })
}

const onStartRoom = (io, socket, roomId) => {
    console.log("Starting room deck... " + deck_id)

    if(socket.currentRoom !== room) { 
        console.log("User not in room! cannot start room deck " + room)
        reject(); 
    }  // Validate that the socket is in the room

    validateAllUsersReady(roomId).then(ready => {
        if(!ready) { return; }

        startRoom(roomId).then(() => {
            console.log("Emitting start room: " + roomId)
            io.to(roomId).emit("TC_START_ROOM")
        })
    }).catch((err) => {
        console.error('Error starting room:', err)
    })
}