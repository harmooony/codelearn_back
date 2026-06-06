const Router = require('express')
const router = new Router()

const taskController = require('../controller/task.controller')

router.post('/task',taskController.createTask)
router.get(
    '/task/lesson/:lessonId',
    taskController.getTasksByLesson
)
router.put('/task/:id',taskController.updateTask)
router.delete('/task/:id',taskController.deleteTask)

module.exports = router