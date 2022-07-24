const Router = require('express')
const router = new Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Client = require('ftp')
const multer = require('multer')
const {v4} = require('uuid')
const getFileType = require('file-type')

const { secret, mysql, ftp } = require('../config/config')

const db = require('knex')(mysql)

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const file = new Client()
file.connect(ftp)

router.get('/showAds', showAds)
router.get('/showUsers', showUsers)
router.post('/reg', reg)
router.post('/login', login)
router.post('/addAds',  upload.single('file'), middleware, addAds)
router.post('/editAds', middleware, editAds)
router.post('/deleteAds', middleware, deleteAds)

module.exports = router

async function reg(req, res) {
    try {
        const { username, password } = req.body || req.params

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
        const { username, password } = req.body || req.params

        const result = await db('accounts').where('username', username)
        if (!result[0]) return res.status(400).json('User not found. Please Registr')

        const validPassword = bcrypt.compareSync(password, result[0].psw)
        if (!validPassword) return res.status(400).json('Password Error')

        const token = generateAccessToken(result[0].id)
        return res.json({token})

    } catch (e) {
        console.error(e)

    }
}

async function showAds(req, res) {
    try {
        // let data = null
        const result = await db('adds').select('*').where({deleted: null})
        result.map((t) => {
            if (t.file)
                file.get(t.file, (err, stream) => {
                    // data = stream.pipe(fs.createWriteStream('uploads/'+t.file))
                })
            // res.setHeader('Content-Tyoe', 'image/png')
            // res.send(__dirname+t.file+'.png')
        })
        // data = fromFile(__dirname_+t.file+'.png')
        // console.log(data)
        return res.json({all:result[0]})
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

        console.log(hash)

        await db('adds').insert({
            creator: username,
            description: description,
            file: hash || null
        }).then((t) => {
            return res.json({message: `Add aded ${hash || 'No file'}`})
        })
    } catch (e) {
        console.error(e)
        return res.json(e)
    }
}

async function editAds(req, res) {
    try {
        const { username, id, description, img } = req.body || req.params

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
        const { username, id } = req.body || req.params

        const result = await db('adds').where({id: id})
        if (username !== result[0].username) return res.json({message: 'Is not you Note'})

        await db('adds').where({id: id}).update({
            deleted: 1
        }).then((t) => {return res.json(t + ' deleted')})
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

async function addFIle(infile, res, hash) {
    const { buffer, originalname } = infile

    await getFileType.fromBuffer(buffer).then((type) => {
        file.put(buffer, hash, (err) => {
            if (err) throw err
            file.end()
        })
        return db('files').insert({
            hash: hash,
            name: originalname,
            type: type.ext
        })
    })
}