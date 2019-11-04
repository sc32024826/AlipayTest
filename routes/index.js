const router = require('koa-router')()
const controller = require('../controller/index')

router.get('/pay', controller.pay)
router.post('/paycallback', controller.payback)
router.get('/success', controller.success)

module.exports = router
