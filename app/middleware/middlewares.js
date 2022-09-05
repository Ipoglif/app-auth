const jwt = require("jsonwebtoken");
const {secret} = require("../../config/config");

function authMiddleware (req, res, next) {
    if (req.method === 'OPTIONS') next()

    try {
        const token = req.headers.authorization

        if (!token) return res.status(400).json('Error User. Please login')

        const decodeData = jwt.verify(token, secret)
        req.user = decodeData

        next()
    } catch (e) {
        console.error(e)
        return res.status(400).json('User not found. Please Registr')
    }
}

module.exports = { authMiddleware }