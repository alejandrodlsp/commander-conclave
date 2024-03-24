module.exports = app => {
    const rooms = require("../controllers/room.controller.js")
    const authenticated = require("../middleware/authenticatedJWT.js").authenticated

    var router = require("express").Router()

    router.get("/", rooms.index)
    router.post("/", rooms.createRoom)
    router.get("/current", rooms.currentRoom)

    app.use("/api/rooms", authenticated, router)
}