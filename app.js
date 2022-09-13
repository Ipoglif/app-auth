const cookieSession = require('cookie-session')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const routes = require('./app/routes/authorization.routes')

const { port, cookieOptions, corsConfig, swagger } = require('./config/config')

const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const app = express()

app.use(express.json())
app.use(express.static(__dirname))
app.use(cookieParser())
app.use(cookieSession(cookieOptions))
app.use(cors(corsConfig))
app.options('*', cors(corsConfig))

app.use('/api', routes)
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerJsDoc(swagger)))

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