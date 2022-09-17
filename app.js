const cookieSession = require('cookie-session')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const routers = require('./app/routes/authorization.routes')

const { port, options, api } = require('./config/config')

const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const app = express()

app.set('trust proxy', 1)
app.use(express.json())
app.use(express.static(__dirname))
app.use(cookieParser())
app.use(cookieSession(options.cookie))
app.use(cors(options.cors))
app.options('*', cors(options.cors))

app.use('/api', routers)
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerJsDoc(api.swagger)))

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

module.exports = { app }