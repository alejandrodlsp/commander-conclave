module.exports = app => {
    require("./login.routes")(app)
    require("./tutorial.routes")(app)
}