const db = require("../../models")
const User = db.User
const helper = require("../helpers/auth/register.helper")

exports.register = (req, res) => {
    validateUserFields(req, res)

    const password_hash = helper.generatePasswordHash(req.body.password)
    const user_params = {
        username: req.body.username,
        password_hash: password_hash,
        jwt_valid_from: new Date().getTime()
    }

    helper.checkUserExists(req.body.username).then(_ => {
        User.create(user_params)
            .then(data => {
                const token = helper.signJWTUser(data)
                res.send({ token: token })
            })
            .catch(err => {
                res.status(500).send({ message: err.message })
            })
    }).catch(_ => {
        res.status(409).send({ message: "User already exists." })
    })
}

exports.login = (req, res) => {
    validateUserFields(req, res)

    User.findOne({ where: { username: req.body.username } })
        .then(user => { 
            if (!user || !helper.comparePasswords(req.body.password, user.password_hash)) {
                return res.status(401).send({ message: "Invalid username or password." })
            }
            user.update({ jwt_valid_from: new Date().getTime() }).then((user) => {
                const token = helper.signJWTUser(user)
                res.send({ token: token })
            })
        })
        .catch(err => {
            res.status(500).send({ message: err.message })
        })
}

exports.me = (req, res) => {
    const user = helper.presentUser(req.user)
    res.send({ user })
}

exports.logout = (req, res) => {
    const user = req.user
    user.update({ jwt_valid_from: null }).then(_ => {
        res.send({ message: "Successfully logged out." })
    })
}

function validateUserFields(req, res) {
    if(!req.body.username) {
        return res.status(400).send({ message: "Username can not be empty." })
    }
    if(!req.body.password) {
        return res.status(400).send({ message: "Password can not be empty." })
    }
}