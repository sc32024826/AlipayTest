const router = require('koa-router')()
const controller = require('../controller/index')
const express = require('../controller/express')
const search = require('../controller/search.js')

router.get('/pay', controller.pay)
router.post('/paycallback', controller.payback)
router.get('/success', controller.success)

//快递查询模块
// router.get('/expressSearch', express.getOrderInfoByJson)
router.get('/expressSearch', search.search)
router.post('/expressSearch', search.search)
//订阅
// router.get('/getExpressTrace',express.subscribe)

//填写物流信息
// router.get('/expressInput',express.expressInfoInput)

//物流回调地址
router.post('/callBack', express.callBack)

module.exports = router
