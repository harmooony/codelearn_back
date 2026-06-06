const Router = require('express')
const router = new Router()
const favoriteController = require('../controller/favorite.controller')
const authenticateJWT = require('../middleware/auth.middleware')

router.post('/favorite', authenticateJWT, favoriteController.addFavorite)
router.delete('/favorite/:courseId', authenticateJWT, favoriteController.removeFavorite)
router.get('/favorites', authenticateJWT, favoriteController.getFavorites)

module.exports = router