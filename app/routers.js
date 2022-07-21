const Router = require('express')
const router = new Router()


router.post('/registration', registraion)
router.post('/login', login)

module.exports = router

function registraion(req, res) {
    try {
        console.log('req ->', req)
        console.log('res ->', res)

    } catch (e) {
        console.error()
    }
}


function login(req, res) {
    try {

    } catch (e) {
        console.error()
    }
}