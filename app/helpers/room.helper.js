const db = require("../../models")
const Room = db.Room
const User = db.User
const RoomUser = db.RoomUser

const getRoomUsers = (room_id) => {
    return new Promise((resolve, reject) => {
        try {
            const room  = room_id
            db.sequelize.query(
                `SELECT u.id, u.username
                FROM "Users" u
                INNER JOIN "RoomUsers" ru ON u."id" = ru."user_id"
                WHERE ru."room_id" = '${room}'`,
                {
                    model: User,
                    mapToModel: true
                }
            ).then((users) => {
                resolve(users)
            })
        } catch (error) {
            reject(error)
        }
    })
}

const getCurrentRoom = (user_id) => {
    return new Promise((resolve, reject) => {
        try {
            db.sequelize.query(
                `SELECT r.*
                FROM "Rooms" r
                INNER JOIN "RoomUsers" ru ON r."id" = ru."room_id"
                WHERE ru."user_id" = '${user_id}'`,
                {
                    model: Room,
                    mapToModel: true
                }
            ).then((rooms) => {
                resolve(rooms)
            })
        } catch (error) {
            reject(error)
        }
    })
}

const validateAllUsersReady = (room_id) => {
    return new Promise((resolve, reject) => {
        try {     
            getRoomUsers(room_id).then(room_users => {
                room_users.forEach(room_user => {
                    if(room_user.deck_id == null) {
                        resolve(false);
                    }
                });
                resolve(true);
            })
        } catch (error) {
            reject(error)
        }
    })
}

const startRoom = (room_id) => {
    return new Promise((resolve, reject) => {
        Room.update({ status: "IN_GAME" }, {
            where: { id: room_id }
        })
        .then(room => {
            resolve(room)
        })
        .catch(err => {
            reject(err)
        })
    })
}

const checkCanJoinRoom = (room_id) => {
    return new Promise((resolve, reject) => {
        try {
            Room.findByPk(room_id).then(room => {
                if(room.status !== "ACTIVE") {
                    return resolve(false)
                }
                getRoomUsers(room_id).then(room_users => {
                    resolve(room_users.length < room.max_players);
                })
            })
        } catch (error) {
            reject(error)
        }
    })
}

const removeRoomIfEmpty = (room_id) => {
    return new Promise((resolve, reject) => {
        try {
            RoomUser.count({ where: { room_id: room_id } }).then(count => {
                if(count == 0) {
                    console.log("Room was empty, removing")
                    Room.destroy({ where: { id: room_id } })
                    resolve()
                } else {
                    resolve()
                }
            })
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    getRoomUsers,
    getCurrentRoom,
    validateAllUsersReady,
    startRoom,
    checkCanJoinRoom,
    removeRoomIfEmpty
}