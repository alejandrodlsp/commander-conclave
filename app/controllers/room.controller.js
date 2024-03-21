const db = require("../../models")
const Room = db.Room

exports.index = (req, res) => {
    Room.findAll()
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Some error occurred while retrieving rooms."})
        });
}

exports.createRoom = (req, res) => {
    if(!req.body.name) {
        return res.status(400).send({ message: "Room name can not be empty."})
    }
    
    const roomParams = {
        name: req.body.name,
        maxPlayers: req.body.maxPlayers || 4,
        status: "ACTIVE"
    }

    Room.create(roomParams)
     .then(data => {
            res.send(data)
        })
     .catch(err => {
            res.status(500).send({ message: err.message || "Some error occurred while creating the room."})
        });
}