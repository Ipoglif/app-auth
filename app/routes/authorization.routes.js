const { authMiddleware } = require('../middleware/middlewares')

const { refresh, registration, login, logout } = require('../handlers/auth.handlers')
const { showUsers } = require('../handlers/users.handlers')

const Router = require('express')
const router = new Router()

router.post('/reg', registration)
router.post('/login', login)
router.get('/showUsers', authMiddleware, showUsers)
router.get('/refresh', refresh)
router.get('/logout', logout)

module.exports = router