const jwt = require("jsonwebtoken")

const authenticated = (req, res, next) => {
    const token = getToken(req)
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET)
        req.user = user
        next()
    } catch (err) {
        return res.status(401).send({ message: "Unauthorized, please log in" })
    }
}

function getToken(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
}

export default authenticated