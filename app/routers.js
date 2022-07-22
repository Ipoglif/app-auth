const Router = require('express')
const router = new Router()
const jwt = require('jsonwebtoken')

const { secret, mysql } = require('../config/config')

const db = require('knex')(mysql)

router.post('/reg', reg)
router.post('/login', login)
router.post('/addAds', middleware, addAds)
router.post('/editAds', editAds)

module.exports = router

async function reg(req, res) {
    try {
        const { username, password } = req.body

        const result = await db('accounts').where('username', username)

        if (result[0] !== undefined && !result[0].length) {
            return res.status(400).json('Must be other Username')
        } else {
            db('accounts').insert({
                username: username,
                psw: password,
            }).then(() => {
                return res.json(`User ${username} created`)
            })

        }

    } catch (e) {
        console.error(e)
    }
}


async function login(req, res) {
    try {
        const { username, password } = req.body
        const result = await db('accounts').where('username', username)
        if (!result[0]) return res.status(400).json('User not found. Please Registr')
        const token = generateAccessToken(result[0].id)
        return res.json({token})

    } catch (e) {
        console.error(e)
    }
}

function addAds(req, res) {
    try {
        const { username, password} = req.body

        db('adds').insert({
            username: username,
            img: password
        }).then(() => {
            return res.json(`Adds aded`)
        })
    } catch (e) {
        console.error(e)
    }
}
function editAds(req, res) {
    try {

    } catch (e) {
        console.error(e)
    }
}

function middleware (req, res, next) {
    if (req.method === 'OPTIONS') {
        next()
    }

    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) return res.status(400).json('User not found. Please Registr')

        const decodeData = jwt.verify(token, secret)
        req.user = decodeData

        next()
    } catch (e) {
        console.error(e)
        return res.status(400).json('User not found. Please Registr')
    }
}

const generateAccessToken = (id) => {
    const payload = {id}

    return jwt.sign(payload, secret, {expiresIn: '24h'})
}