const express = require('express')
const routers = require('./app/routers')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const { port, mysql, swagger } = require('./config/config')

const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const app = express()

const db = require('knex')(mysql)

app.use(express.json())
app.use(express.static(__dirname))
app.use(cors())
app.use(cookieParser())

app.use('/api', routers)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsDoc(swagger)))


app.get('/', async (req,res) => {
    await db('accounts').where({username: 'admin'})
        .then((users) => {
            return res.json({users})
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