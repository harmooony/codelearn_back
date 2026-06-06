const Router = require('express')
const router = new Router()
const subscriptionController = require('../controller/subscription.controller')
const authenticateJWT = require('../middleware/auth.middleware')

router.post('/subscription', authenticateJWT, subscriptionController.addSubscription)
router.delete('/subscription/:courseId', authenticateJWT, subscriptionController.removeSubscription)
router.get('/subscriptions', authenticateJWT, subscriptionController.getSubscriptions)

module.exports = router