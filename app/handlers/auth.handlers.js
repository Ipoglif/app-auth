const { generateTokens } = require('./tokens.handlers')
const authRepository = require('../repositories/auth.repository')
const userRepository = require('../repositories/users.repository')

const bcrypt = require("bcryptjs")

async function refresh(req, res) {
    try {
        const [ empty, tokenData ] = req.headers.cookie.split('=')

        if (!tokenData) throw res.status(401).json({message: 'Error Token'})

        const authData = await authRepository.search({refreshToken: tokenData})

        const tokens = await generateTokens(authData.email)

        if (authData) {
            await authRepository.update({refreshToken: tokens.refreshToken}, {refreshToken: tokenData})
        }

        res.cookie('refreshToken', tokens.refreshToken, {
            maxAge: 60000,
            httpOnly: true,
            sameSite: 'none',
            secure: true
        })

        return res.json({message : 'Succes'})
    } catch (e) {
        console.error(e)
        return res.status(401).json('User not authorized')
    }
}

async function registration(req, res) {
    try {
        const { email, password } = req.body || req.params

        const result = await authRepository.search({email})

        if (result !== undefined && !result.length) return res.status(400).json(`${email}: Name already in use`)

        await authRepository.insert({
            email: email,
            psw: bcrypt.hashSync(password, 7),
        }).then( (id) => {
                userRepository.insert({
                    user_id: id,
                    user_name: 'sec',
                    user_icon: 'sec_personal_icon',
                    role: 'user'})
        })

        return res.json({message: `User ${email}, created`})
    } catch (e) {
        console.error(e)
        return res.status(400).json({message: e})
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body || req.params

        const result = await authRepository.search({email})
        if (!result) return res.status(400).json({message: `${email}: User not found. Please Registr`})

        const validPassword = bcrypt.compareSync(password, result.psw)
        if (!validPassword) return res.status(400).json({message: 'Password Error'})

        const { accessToken, refreshToken } = await generateTokens({
            email,
            psw: result.psw
        })

        res.set({accessToken})
        res.cookie('refreshToken', refreshToken, {
            maxAge: 60000,
            httpOnly: true,
            sameSite: 'none',
            secure: true
        })

        return res.json({accessToken})
    } catch (e) {
        console.error(e)
        return res.json({message: e})
    }
}

async function logout(req, res) {
    try {
        if (!req.headers.cookie) return res.status(401).json({message: 'Error Token'})

        const [ empty, refreshToken ]  = req.headers.cookie.split('=')

        await authRepository.update({refreshToken: null}, {refreshToken})

        res.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: 'none',
            secure: true
        })

        return res.json({message: 'Token refresh is clean'})
    } catch (e) {
        console.error(e)
    }
}

module.exports = {
    refresh : refresh,
    registration : registration,
    login : login,
    logout : logout,
}