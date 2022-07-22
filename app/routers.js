const Router = require('express')
const router = new Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const { secret, mysql } = require('../config/config')

const db = require('knex')(mysql)

router.post('/reg', reg)
router.post('/login', login)
router.get('/showAds', middleware, showAds)
router.post('/addAds', middleware, addAds)
router.post('/editAds', middleware, editAds)
router.post('/deleteAds', middleware, deleteAds)

module.exports = router

async function reg(req, res) {
    try {
        const { username, password } = req.body

        const result = await db('accounts').where('username', username)

        if (result[0] !== undefined && !result[0].length) {
            return res.status(400).json('Must be other Username')
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
        const { username, password } = req.body

        const result = await db('accounts').where('username', username)
        if (!result[0]) return res.status(400).json('User not found. Please Registr')

        const validPassword = bcrypt.compareSync(password, result.psw)
        if (!validPassword) return res.status(400).json('Password Error')

        const token = generateAccessToken(result[0].id)
        return res.json({token})

    } catch (e) {
        console.error(e)
    }
}

async function showAds(req, res) {
    try {
        const result = await db('adds').select('*')
        return res.json({'all Adds:': result})
    } catch (e) {
        console.error(e)
    }
}

async function addAds(req, res) {
    try {
        const { username, description, img } = req.body

        await db('adds').insert({
            creator: username,
            description: description,
            img: img
        }).then(() => {
            return res.json(`Adds aded`)
        })
    } catch (e) {
        console.error(e)
    }
}

async function editAds(req, res) {
    try {
        const { username, id, description, img } = req.body

        const result = await db('adds').where({id: id})
        if (username !== result[0].username) return res.json({message: 'Is not you Note'})

        await db('adds').where({id: id}).update({
            description: description,
            img: img
        }).then((t) => {return res.json(t + ' updated')})
    } catch (e) {
        console.error(e)
    }
}

async function deleteAds(req, res) {
    try {
        const { username, id } = req.body

        const result = await db('adds').where({id: id})
        if (username !== result[0].username) return res.json({message: 'Is not you Note'})

        await db('adds').where({id: id}).update({
            deleted: 1
        }).then((t) => {return res.json(t + ' deleted')})
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