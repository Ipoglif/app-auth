const { generateTokens } = require('./tokens.handlers')
const { mysql } = require("../../config/config")

const db = require('knex')(mysql)

const bcrypt = require("bcryptjs")

async function refresh(req, res) {
    try {
        const cookie = req.headers.cookie.split('=')[1]

        if (!cookie) throw res.status(401).json({message: 'Ошибка токена иди нахуй'})

        const tokenData = await db('accounts').where('refreshToken', cookie)

        const tokens = await generateTokens(1)

        if (tokenData[0]) {
            tokenData.refreshToken = tokens.refreshToken
            db('accounts')
                .where('refreshToken', cookie)
                .update('refreshToken', tokens.refreshToken)
                .then(() => console.log('Token updated'))
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
        const { username, password } = req.body || req.params

        const result = await db('accounts').where('username', username)

        if (result[0] !== undefined && !result[0].length) {
            return res.status(400).json(`${username}: Name already in use`)
        } else {
            await db('accounts').insert({
                username: username,
                psw: bcrypt.hashSync(password, 7),
            }).then(() => {return res.json(`User ${username} created`)})
        }
    } catch (e) {
        console.error(e)
        return res.status(400).json({message: e})
    }
}

async function login(req, res) {
    try {
        const { username, password } = req.body || req.params

        const result = await db('accounts').where('username', username)
        if (!result[0]) return res.status(400).json({message: `${username}: User not found. Please Registr`})

        const validPassword = bcrypt.compareSync(password, result[0].psw)
        if (!validPassword) return res.status(400).json({message: 'Password Error'})

        const tokens = await generateTokens(result[0].id)

        let scheme = {}

        const resultdb = await db('accounts').where({username: username})

        scheme.email = 'test@gmail.com'
        scheme.id = resultdb[0].id
        scheme.role = 'admin'
        scheme.user_icon = 'URL_icon'
        scheme.user_name = resultdb[0].username

        res.set({
            'accessToken' : tokens.accessToken
        })

        res.cookie('refreshToken', tokens.refreshToken, {
            maxAge: 60000,
            httpOnly: true,
            sameSite: 'none',
            secure: true
        })

        return res.json(scheme)

    } catch (e) {
        console.error(e)
        return res.json({message: e})
    }
}

async function logout(req, res) {
    try {
        const message = {}
        const cookie = req.headers.cookie.split('=')[1]

        console.log('headers -> ', req.headers)
        console.log('only cookie ', cookie)

        await db('accounts')
            .where('refreshToken', cookie)
            .update('refreshToken', 'null')
            .then(() => message.db = 'Token in db equal NULL')

        res.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: 'none',
            secure: true
        })

        message.refreshToken = 'Token refresh is clean '

        return res.json(message)
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