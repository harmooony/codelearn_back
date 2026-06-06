const Router = require('express')
const router = new Router()

const courseController = require('../controller/course.controller')

router.post('/course', courseController.createCourse)
router.get('/courses', courseController.getCourses)
router.get('/course/:id', courseController.getOneCourse)
router.put('/course/:id', courseController.updateCourse)
router.delete('/course/:id', courseController.deleteCourse)
router.get('/courses/creator/:creator_id', courseController.getCoursesByCreator)

module.exports = router