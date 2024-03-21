const db = require("../../models")
const jwt = require("jsonwebtoken")
const User = db.User

exports.authenticated = (req, res, next) => {
    const token = getToken(req)
    try {
        const jwt_user = jwt.verify(token, process.env.JWT_SECRET)
        User.findByPk(jwt_user.id).then(data => {
          if (!validJwtIssue(data, token)) {
            return res.status(401).send({ message: "This token is no longer valid." })
          }
          req.user = data
          next()
        })
    } catch (err) {
        return res.status(401).send({ message: "Invalid credentials, please log in." })
    }
}

function validJwtIssue(user, token) {
  if(!user.jwt_valid_from) return false

  var decoded = jwt.decode(token, { complete: true })
  var date = new Date(decoded.payload.iat * 1000 + 1000)

  return (user.jwt_valid_from < date)
}

function getToken(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1]
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
}