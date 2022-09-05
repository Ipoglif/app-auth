const express = require('express')
const cors = require('cors')

const routers = require('./app/routes/authorization')
const cookieParser = require('cookie-parser')

const { port, mysql, swagger } = require('./config/config')

const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const app = express()

const db = require('knex')(mysql)

const corsConfig = {
    origin: true,
    credentials: true,
}

app.use(express.json())
app.use(express.static(__dirname))
app.use(cookieParser())
app.use(cors(corsConfig))
app.options('*', cors(corsConfig))

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