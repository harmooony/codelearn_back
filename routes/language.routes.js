const Router = require('express');
const router = new Router();
const controller = require('../controller/language.controller');

router.get('/languages', controller.getLanguages);

module.exports = router;