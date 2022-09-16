const authRepository = require('../repositories/auth.repository')

const jwt = require("jsonwebtoken")

async function generateTokens(data) {

    const accessToken = jwt.sign(data, process.env.JWT_ACCESS_SECRET, {expiresIn: '480s'})
    const refreshToken = jwt.sign(data, process.env.JWT_REFRESH_SECRET, {expiresIn: '560s'})

    const { email } = data

    const tokenData = await authRepository.search({email})

    if (tokenData) await authRepository.update({refreshToken}, {email})

    return {
        accessToken,
        refreshToken
    }
}

function setResponse(res, accessToken, refreshToken){
    res.set({accessToken})
    res.cookie('refreshToken', refreshToken, {
        maxAge: 60000,
        httpOnly: true,
        sameSite: 'none',
        secure: true
    })

    return res.json({accessToken})
}

module.exports = {
    generateTokens : generateTokens,
    setResponse : setResponse,
}