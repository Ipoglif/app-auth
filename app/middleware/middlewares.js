const jwt = require("jsonwebtoken")
const { mysql } = require("../../config/config")

const db = require('knex')(mysql)

function authMiddleware (req, res, next) {
    if (req.method === 'OPTIONS') next()

    const { authorization } = req.headers

    console.log(authorization)

    try {
        const { authorization, cookie } = req.headers

        if (!authorization) return res.status(401).json('User not authorized')

        const decodeData = jwt.verify(authorization, process.env.JWT_ACCESS_SECRET)

        req.user = decodeData

        next()
    } catch (e) {
        console.error(e)
        return res.status(400).json('User not found. Please Registr')
    }
}

module.exports = { authMiddleware }