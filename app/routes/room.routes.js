module.exports = app => {
    const rooms = require("../controllers/room.controller.js")

    var router = require("express").Router()

    router.get("/", rooms.index)
    router.post("/", rooms.createRoom)

    app.use("/api/rooms", router)
}