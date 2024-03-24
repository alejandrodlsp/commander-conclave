const db = require("../../models")
const Room = db.Room
const User = db.User

exports.getRoomUsers = (room_id) => {
    return new Promise((resolve, reject) => {
        try {
            db.sequelize.query(
                `SELECT u.id, u.username
                FROM "Users" u
                INNER JOIN "RoomUsers" ru ON u."id" = ru."user_id"
                WHERE ru."room_id" = '${room_id}'`,
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

exports.getCurrentRoom = (user_id) => {
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