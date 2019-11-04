const router = require('koa-router')()
const controller = require('../controller/index')
const express = require('../controller/express')

router.get('/pay', controller.pay)
router.post('/paycallback', controller.payback)
router.get('/success', controller.success)

//快递查询模块
router.get('/search', express.getOrderTracesByJson)

module.exports = router
