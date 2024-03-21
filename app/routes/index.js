module.exports = app => {
    require("./auth.routes")(app)
    require("./tutorial.routes")(app)
    require("./room.routes")(app)
}