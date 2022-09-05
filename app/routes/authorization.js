const { secret, mysql } = require('../../config/config')
const { authMiddleware } = require('../middleware/middlewares')

const Router = require('express')
const router = new Router()

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const db = require('knex')(mysql)

router.get('/showUsers', showUsers)
router.post('/reg', reg)
router.post('/login', login)
router.get('/me', authMiddleware, me)

module.exports = router

const generateAccessToken = (id) => {
    const payload = { id }
    return jwt.sign(payload, secret, {expiresIn: '24h'})
}

async function reg(req, res) {
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
    }
}

async function login(req, res) {
    try {
        const { username, password } = req.body || req.params

        let scheme = {}

        const result = await db('accounts').where('username', username)
        if (!result[0]) return res.status(400).json(`${username}: User not found. Please Registr`)

        const validPassword = bcrypt.compareSync(password, result[0].psw)
        if (!validPassword) return res.status(400).json('Password Error')

        const token = generateAccessToken(result[0].id)

        scheme.message = 'Authorized'

        res.cookie('Authorization', token, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})

        return res.json(scheme)

    } catch (e) {
        console.error(e)

    }
}

async function me(req, res) {
    try {
        let scheme = {}

        const result = await db('accounts').where({username: 'admin'})

        scheme.email = 'test@gmail.com'
        scheme.id = result[0].id
        scheme.role = 'admin'
        scheme.user_icon = 'URL_icon'
        scheme.user_name = result[0].username

        return res.json(scheme)
    } catch (e) {
        console.error(e)
    }
}

async function showUsers(req, res) {
    try {
        const result = await db('accounts').select('*')
        return res.json({result})
    } catch (e) {
        console.error(e)
    }
}