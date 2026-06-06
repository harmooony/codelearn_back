const Router = require('express')

const router = new Router()

const authController = require('../controller/auth.controller')
const authenticateJWT = require('../middleware/auth.middleware')

router.post('/register', authController.register)

router.post('/login', authController.login)

router.get(
    '/auth',
    authenticateJWT,
    authController.check
)

module.exports = router