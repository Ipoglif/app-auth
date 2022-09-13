const jwt = require("jsonwebtoken")

function authMiddleware (req, res, next) {
    if (req.method === 'OPTIONS') next()
    try {
        const { authorization } = req.headers

        if (!authorization) return res.status(401).json('User not authorized')

        const decodeData = jwt.verify(authorization, process.env.JWT_ACCESS_SECRET)

        req.user = decodeData

        next()
    } catch (e) {
        console.error(e)
        return res.status(401).json('User not authorized')
    }
}

module.exports = { authMiddleware : authMiddleware }