const router = require('koa-router')()
const controller = require('../controller/index')
const express = require('../controller/express')

router.get('/pay', controller.pay)
router.post('/paycallback', controller.payback)
router.get('/success', controller.success)

//快递查询模块
router.get('/expressSearch', express.getOrderTracesByJson)

//填写物流信息
router.get('/expressInput',express.expressInfoInput)

module.exports = router
