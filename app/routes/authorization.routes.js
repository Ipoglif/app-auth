const { authMiddleware } = require('../middleware/middlewares')

const { refresh, registration, login, logout } = require('../handlers/auth.handlers')
const { showUsers, me } = require('../handlers/users.handlers')

const Router = require('express')
const router = new Router()

router.post('/registration', registration)
router.post('/login', login)
router.get('/me', authMiddleware, me)
router.get('/showUsers', authMiddleware, showUsers)
router.get('/refresh', refresh)
router.get('/logout', logout)

module.exports = router