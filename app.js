const express = require('express')
const routers = require('./app/routers')
const port = process.env.PORT || 3000

const app = express()

app.use(express.json())
app.use('/auth', routers)

app.get('/', (req,res) => {
    res.json('Hello this first page')
})

const start = () => {
    try {
        app.listen(port)
        console.log(process.env)
        console.log(process.env.PORT)
    } catch (e) {
        console.error(e)
    }
}

start()