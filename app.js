const express = require('express')
const routers = require('./app/routers')
const { secret, mysql } = require('./config/config')
const port = process.env.PORT || 3000

const app = express()

const db = require('knex')(mysql)

app.use(express.json())
app.use('/api', routers)
app.use(function (req, res, next) {
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
    res.setHeader('Access-Control-Allow-Credentials', true)
    next()
})

app.get('/', async (req,res) => {
    await db('accounts').where({username: 'admin'})
        .then((c) => {
            return res.json({c})
        })
})

const start = () => {
    try {
        app.listen(port, () => {
            console.log(`Server is started ${port}`)
        })
    } catch (e) {
        console.error(e)
    }
}

start()