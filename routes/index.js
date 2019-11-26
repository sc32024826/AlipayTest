const router = require('koa-router')();
const ctrl = require('../controller/index');


//快递查询模块
router.post('/expressSearch', ctrl.search);
//订阅
router.post('/sub', ctrl.sub);

router.post('/findWithSub', ctrl.findWithSub)

//物流回调地址
router.post('/callBack', ctrl.callBack);



module.exports = router;
