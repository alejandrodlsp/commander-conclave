module.exports = app => {
    const auth = require("../controllers/auth.controller.js")
    const authenticated = require("../middleware/authenticatedJWT.js").authenticated

    var router = require("express").Router()

    router.post("/", auth.login)
    router.delete("/", authenticated, auth.logout)
    router.post("/register", auth.register)
    router.get("/me", authenticated, auth.me)

    app.use("/api/auth", router)
}