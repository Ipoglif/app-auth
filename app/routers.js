const Router = require('express')
const router = new Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Client = require('ftp')
const multer = require('multer')
const {v4} = require('uuid')
const getFileType = require('file-type')
const fs = require('fs')

const { secret, mysql, ftp, host } = require('../config/config')

const db = require('knex')(mysql)

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const file = new Client()
// file.connect(ftp)

//ads
router.get('/showAds', showAds)
router.post('/addAds',  upload.single('file'), middleware, addAds)
router.post('/updateAds', upload.single('file'), middleware, updateAds)
router.post('/deleteAds', middleware, deleteAds)

module.exports = router

async function showAds(req, res) {
    try {
        const result = await db('adds').select('*').where({deleted: null})
        let adsWithFile = []

        for (const key of result) {
            const num = adsWithFile.push(key) - 1
            if (key.file) {
                await db('files').where({'hash': key.file}).then(t => {
                    file.get(key.file, (err, stream) => {
                        // stream.pipe(fs.createWriteStream(`uploads/${key.file}.${t[0].type}`))
                    })

                    adsWithFile[num]['fileUrl'] = `${host}/uploads/${key.file}.${t[0].type}`
                })
            }
        }
        return res.json(adsWithFile)
    } catch (e) {
        console.error(e)
    }
}

async function addAds(req, res) {
    try {
        const { username, description } = req.body || req.params

        let hash
        if (req.file) {
            hash = v4()
            await addFIle(req.file, res, hash)
        }

        await db('adds').insert({
            creator: username,
            description: description,
            file: hash || null
        }).then((t) => {
            return res.json({message: `${t[0].id} ads is public`})
        })
    } catch (e) {
        console.error(e)
        return res.status(403).json({message: 'format not support'})
    }
}

async function updateAds(req, res) {
    try {
        const { id, username, description } = req.body || req.params

        const result = await db('adds').where({id: id})
        if (username !== result[0].creator) return res.status(400).json({message: 'Is not you Note'})

        let hash
        if (req.file) {
            hash = v4()
            await addFIle(req.file, res, hash)
        }

        db('adds').where({id: id}).update({
            description: description,
            file: hash || result[0].file
        }).then((t) => {
            return res.json({message: `${id}: Ads update`})
        })
    } catch (e) {
        console.error(e)
        return res.status(403).json({message: 'format not support'})
    }
}

async function deleteAds(req, res) {
    try {
        const { id, username } = req.body || req.params

        const result = await db('adds').where({id: id})
        if (username !== result[0].creator) return res.status(400).json({message: 'Is not you Note'})

        await db('adds').where({id: id}).update({
            deleted: 1
        }).then((t) => {return res.json(`${id}: ads deleted`)})
    } catch (e) {
        console.error(e)
    }
}


function middleware (req, res, next) {
    if (req.method === 'OPTIONS') {
        next()
    }

    try {
        const token = req.headers.authorization

        if (!token) return res.status(400).json('Error User. Please login')

        const decodeData = jwt.verify(token, secret)
        req.user = decodeData

        next()
    } catch (e) {
        console.error(e)
        return res.status(400).json('User not found. Please Registr')
    }
}

const generateAccessToken = (id) => {
    const payload = { id }
    return jwt.sign(payload, secret, {expiresIn: '24h'})
}

async function addFIle(infile, res, hash) {
    const { buffer, originalname } = infile
    getFileType.fromBuffer(buffer).then((type) => {
        file.put(buffer, hash, (err) => {
            if (err) res.status(400).json({message: 'plz other format'})
            return
        })
        return db('files').insert({
            hash: hash,
            name: originalname,
            type: type.ext
        }).then()

    })
}
