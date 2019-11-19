const router = require('koa-router')();
const express = require('../controller/express');
const search = require('../controller/search.js');


//快递查询模块
router.post('/expressSearch', search.search);
//订阅
router.get('/sub',express.subscribe);

//物流回调地址
router.post('/callBack', express.callBack);

module.exports = router;
