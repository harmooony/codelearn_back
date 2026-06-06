const Router = require('express')
const router = new Router()
const controller = require('../controller/code.controller')

router.post('/run', controller.run)

// Добавляем роут для сабмита задачи
router.post('/submit', controller.submitTask)

module.exports = router