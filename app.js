const express = require('express')
const routers = require('./app/routers')
const { secret, mysql } = require('./config/config')
const port = process.env.PORT || 3000

const app = express()

const db = require('knex')(mysql)

app.use(express.json())
app.use('/auth', routers)

app.get('/', async (req,res) => {
    const t = await db('accounts').where({username: 'admin'})
    res.json(t)

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