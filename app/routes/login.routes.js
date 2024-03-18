module.exports = app => {
    const login = require("../controllers/login.controller.js")
    const authenticated = require("../middleware/authenticatedJWT.js")

    var router = require("express").Router()

    router.post("/register", login.register)
    router.get("/", login.login)
    router.get("/me", authenticated, login.me)

    app.use("/api/login", router)
}