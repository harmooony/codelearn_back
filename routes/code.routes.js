const Router = require('express')
const router = new Router()
const controller = require('../controller/code.controller')

router.post('/run', controller.run)
router.post('/submit', controller.submitTask)

module.exports = router