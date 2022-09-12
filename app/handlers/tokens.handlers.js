const { mysql } = require("../../config/config")

const db = require('knex')(mysql)

const jwt = require("jsonwebtoken")

async function generateTokens(username) {
    const payload = {
        username : username
    }
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '15000'})
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '1m'})

    const tokenData = await db('accounts').where(payload)

    if (tokenData[0]) {
        tokenData.refreshToken = refreshToken
        db('accounts').where(payload).update('refreshToken', refreshToken)
            .then(() => console.log('Token updated'))
    }

    return {
        accessToken,
        refreshToken
    }
}

module.exports = {
    generateTokens : generateTokens,
}