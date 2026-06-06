const Router = require('express')
const router = new Router()

const taskTestController = require('../controller/taskTest.controller')

router.post('/task-test',taskTestController.createTest)
router.get('/task/:taskId/tests',taskTestController.getTestsByTask)
router.put('/task-test/:id',taskTestController.updateTest)
router.delete('/task-test/:id',taskTestController.deleteTest)

module.exports = router