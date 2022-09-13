const authRepository = require('../repositories/auth.repository')

const jwt = require("jsonwebtoken")

async function generateTokens(data) {

    const accessToken = jwt.sign(data, process.env.JWT_ACCESS_SECRET, {expiresIn: '15000'})
    const refreshToken = jwt.sign(data, process.env.JWT_REFRESH_SECRET, {expiresIn: '1m'})

    const { email } = data

    const tokenData = await authRepository.search({email})

    if (tokenData) {
        await authRepository.update({refreshToken}, {email})
    }

    return {
        accessToken,
        refreshToken
    }
}

module.exports = {
    generateTokens : generateTokens,
}