const db = require("../../models")
const RoomUser = db.RoomUser

const getOrCreateRoomUser = (room_id, user_id) => {
    return new Promise((resolve, reject) => {
        try {
            RoomUser.findOne({ 
                where: { 
                    room_id: room_id, 
                    user_id: user_id
                } 
            }).then(user => {
                if (!user) {
                    console.log("\nRoom user not found, creating one for user " + user_id)
                    RoomUser.create({
                        room_id,
                        user_id,
                        deck_id: null
                    }).then(user => {
                        resolve(user)
                    })
                } else {
                    console.log("\nRoom user found for user " + user_id)
                    resolve(user)
                }
            })
        } catch (error) {
            reject(error)
        }
    })
}

const selectDeck = (room_id, user_id, deck_id) => {
    return new Promise((resolve, reject) => {
        try {
            RoomUser.update({ deck_id }, {
                where: { 
                    room_id: room_id, 
                    user_id: user_id 
                }
            })
            .then(room_user => {
                resolve(room_user)
            })
            .catch(err => {
                reject(err)
            })
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    getOrCreateRoomUser,
    selectDeck
}