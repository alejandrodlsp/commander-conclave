const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const db = require("../../../models")
const User = db.User

exports.checkUserExists = (username) => {
    return new Promise((resolve, reject) => {
        User.findOne({
            where: {
                username: username
            }
        })
          .then(user => {
                if (user) {
                    reject(new Error("User already exists"))
                } else {
                    resolve()
                }
            })
          .catch(err => {
                reject(err)
            })
    })
}

exports.generatePasswordHash = (password) => {
    return bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS))
}

exports.comparePasswords = (password, hash) => {
    return bcrypt.compareSync(password, hash)
}

exports.signJWTUser = (user) => {
    const payload = {
        id: user.id,
        username: user.username,
    }
    const options = {
        expiresIn: "24h"
    }
    return jwt.sign(payload, process.env.JWT_SECRET, options)
}

exports.presentUser = (user) => {
    const userObject = user.toJSON()
    delete userObject.password_hash

    return userObject
}