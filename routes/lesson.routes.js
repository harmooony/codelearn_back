const Router = require('express')
const router = new Router()

const lessonController = require('../controller/lesson.controller')

router.post('/lesson', lessonController.createLesson)
router.get('/lessons', lessonController.getLessons)
router.get('/lesson/:id', lessonController.getOneLesson)
router.get('/course/:courseId/lessons', lessonController.getLessonsByCourse)
router.put('/lesson/:id', lessonController.updateLesson)
router.delete('/lesson/:id', lessonController.deleteLesson)
router.get(
    '/lesson/type/:contentTypeId',
    lessonController.getLessonsByType
)

module.exports = router