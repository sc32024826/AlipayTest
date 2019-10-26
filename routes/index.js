const router = require('koa-router')()
// const controller = require('../controller/index')
const AlipaySdk = require('alipay-sdk').default;
const AlipayFormData = require('alipay-sdk/lib/form').default
const fs = require('fs')
const path = require('path')
const PRIVATE_KEY_PATH = path.join(__dirname,'../config/pem/private.pem')
const PUBLIC_KEY_PATH = path.join(__dirname,'../config/pem/public.pem')
// console.log(filepath);

const PRIVATE_KEY = fs.readFileSync(PRIVATE_KEY_PATH, 'utf8')
const PUBLIC_KEY = fs.readFileSync(PUBLIC_KEY_PATH,'utf8')


router.get('/pay', async (ctx) => {
    const alipaySdk = new AlipaySdk({
      appId: '2016101200666016',
      privateKey: PRIVATE_KEY,
      gateway: "https://openapi.alipaydev.com/gateway.do",
      keyType: 'PRIVATE KEY',
      alipayPublicKey:PUBLIC_KEY
    });
  
  
    const formData = new AlipayFormData()
    formData.setMethod("get")
    formData.addField("notifyUrl", "") // 回调地址必须为当前服务的线上地址！
    formData.addField("returnUrl", "http://www.baidu.com")
    formData.addField("bizContent", {
      body: "测试商品",
      subject: "女装",
      outTradeNo: new Date().valueOf(),
      totalAmount: "88.88",
      productCode: "QUICK_WAP_WAY"
    })
    const result = await alipaySdk.exec("alipay.trade.wap.pay", {}, {
      formData: formData,
      validateSign: true
    })
    ctx.body = result
  })

module.exports = router
