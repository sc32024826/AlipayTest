const router = require('koa-router')();
const express = require('../controller/express');
const ctrl = require('../controller/index');


//快递查询模块
router.post('/expressSearch', ctrl.search);
//订阅
router.post('/sub',ctrl.sub);

//物流回调地址
router.post('/callBack', express.callBack);

module.exports = router;
