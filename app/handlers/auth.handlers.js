const { generateTokens } = require('./tokens.handlers')
const authRepository = require('../repositories/auth.repository')
const userRepository = require('../repositories/users.repository')

const bcrypt = require("bcryptjs")

async function refresh(req, res) {
    try {
        const refreshToken = req.headers.cookie.split('=')[1]

        if (!refreshToken) throw res.status(401).json({message: 'Ошибка токена иди нахуй'})

        const tokenData = await repository.search({refreshToken})

        const tokens = await generateTokens(tokenData.email)

        if (tokenData) {
            await authRepository.update({
                'refreshToken': tokens.refreshToken},
                {refreshToken})
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

        if (result !== undefined && !result.length) {
            return res.status(400).json(`${email}: Name already in use`)
        } else {
            await authRepository.insert({
                email: email,
                psw: bcrypt.hashSync(password, 7),
            }).then( () => {
                userRepository.insert({
                    email,
                    user_name: 'sec',
                    user_icon: 'sec_personal_icon',
                    role: 'user'
                })
            })
            return res.json({message: `User ${email}, created`})
        }
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

        const { psw, id } = result

        const { accessToken, refreshToken } = await generateTokens({
            email,
            psw
        })

        const userResult = await userRepository.search({id})

        res.set({accessToken})
        res.cookie({refreshToken}, {
            maxAge: 60000,
            httpOnly: true,
            sameSite: 'none',
            secure: true
        })

        return res.json({userResult, accessToken})
    } catch (e) {
        console.error(e)
        return res.json({message: e})
    }
}

async function logout(req, res) {
    try {
        const [ fistData, secData]  = req.headers.cookie.split('=')

        let refreshToken = null

        await authRepository.update({refreshToken}, {secData})

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