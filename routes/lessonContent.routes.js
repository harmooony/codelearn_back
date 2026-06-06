const Router = require('express')
const router = new Router()

const lessonContentController = require('../controller/lessonContent.controller')

router.post('/lesson-content',lessonContentController.createContent)
router.get('/lesson/:lessonId/content',lessonContentController.getContentByLesson)
router.put('/lesson-content/:id',lessonContentController.updateContent)
router.delete('/lesson-content/:id',lessonContentController.deleteContent)

module.exports = router