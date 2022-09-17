const { generateTokens } = require('./tokens.handlers')
const authRepository = require('../repositories/auth.repository')
const userRepository = require('../repositories/users.repository')
const bcrypt = require("bcryptjs")

async function refresh(req, res) {
    try {
        console.log(req)
        const { refreshToken } = req.session
        if (!refreshToken) return res.status(401).json({message: 'Empty cookie'})

        const authData = await authRepository.search({refreshToken})

        const newTokens = await generateTokens({
            email: authData.email,
            psw: authData.psw
        })

        if (authData) {
            await authRepository.update({refreshToken: newTokens.refreshToken}, {refreshToken})
        }

        req.session.refreshToken = newTokens.refreshToken
        res.set({accessToken: newTokens.accessToken})

        return res.json({accessToken: newTokens.accessToken})
    } catch (e) {
        console.error(e)
        return res.status(500).json({message: e})
    }
}

async function registration(req, res) {
    try {
        const { email, password, user_name } = req.body || req.params
        if (!email || !password || !user_name) return res.status(401).json('fields must be fill')

        const authResult = await authRepository.search({email})
        if (authResult !== undefined && !authResult.length) return res.status(400).json(`${email}: Name already in use`)

        const userResult = await userRepository.search({user_name})
        if (userResult !== undefined && !userResult.length) return res.status(401).json(`${user_name}: already in use. Use other username`)

        await authRepository.insert({
            email: email,
            psw: bcrypt.hashSync(password, 7),
        }).then( (id) => {
                userRepository.insert({
                    user_id: id,
                    user_name,
                    user_icon: 'sec_personal_icon' || null,
                    role: 'user'})
        })

        return res.json({message: `User ${email}, created`})
    } catch (e) {
        console.error(e)
        return res.status(500).json({message: e})
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body || req.params
        if (!email || !email) return res.status(400).json({message: 'Fields Must Be: Email, Password'})

        const result = await authRepository.search({email})
        if (!result) return res.status(400).json({message: `${email}: User not found. Please Registr`})

        const validPassword = bcrypt.compareSync(password, result.psw)
        if (!validPassword) return res.status(400).json({message: 'Password Error'})

        const { accessToken, refreshToken } = await generateTokens({
            email,
            psw: result.psw
        })

        req.session.refreshToken = refreshToken
        res.set({accessToken: accessToken})

        return res.json({accessToken})
    } catch (e) {
        console.error(e)
        return res.status(500).json({message: e})
    }
}

async function logout(req, res) {
    try {
        const { refreshToken } = req.session
        if (!refreshToken) return res.status(401).json({message: 'Error Token'})

        await authRepository
            .update({refreshToken: null}, {refreshToken})
            .then( () => {req.session = null})

        return res.json({message: 'Logouted'})
    } catch (e) {
        console.error(e)
        return res.status(500).json({message: e})
    }
}

module.exports = {
    refresh : refresh,
    registration : registration,
    login : login,
    logout : logout,
}