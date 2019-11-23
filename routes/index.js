const router = require('koa-router')();
const ctrl = require('../controller/index');
const test = require('../controller/test')


//快递查询模块
router.post('/expressSearch', ctrl.search);
//订阅
router.post('/sub', ctrl.sub);

router.post('/findWithSub', test.findWithSub)

//物流回调地址
router.post('/callBack', ctrl.callBack);



module.exports = router;
