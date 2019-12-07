const router = require('koa-router')();
const ctrl = require('../controller/index');


//快递查询模块
router.post('/expressSearch', ctrl.search);

module.exports = router;
