const router = require('koa-router')()
// const controller = require('../controller/index')
const AlipaySdk = require('alipay-sdk').default;
const AlipayFormData = require('alipay-sdk/lib/form').default
const fs = require('fs')
const path = require('path')
const PRIVATE_KEY_PATH = path.join(__dirname, '../config/pem/APP_PRIVATE_KEY.pem')  //应用私钥
const PUBLIC_KEY_PATH = path.join(__dirname, '../config/pem/ALIPAY_PUBLIC_KEY.pem')  //支付宝公钥
// console.log(filepath);

const PRIVATE_KEY = fs.readFileSync(path.resolve(PRIVATE_KEY_PATH), 'utf8')
const PUBLIC_KEY = fs.readFileSync(path.resolve(PUBLIC_KEY_PATH), 'utf8')


router.get('/pay', async (ctx) => {
	const alipaySdk = new AlipaySdk({
		appId: '2016101500693236',
		privateKey: PRIVATE_KEY,
		gateway: "https://openapi.alipaydev.com/gateway.do",
		alipayPublicKey: PUBLIC_KEY,
	});

	// 请求参数 
	const formData = new AlipayFormData()
	formData.setMethod("get")
	formData.addField("notifyUrl", "http://106.54.20.38:3000/paycallback") // 回调地址必须为当前服务的线上地址！
	formData.addField("returnUrl", "http://106.54.20.38:3000/success")
	formData.addField("bizContent", {
		body: "测试商品",
		subject: "女装",
		outTradeNo: new Date().valueOf(),
		totalAmount: "88.88",
		productCode: "FAST_INSTANT_TRADE_PAY"
	})

	//alipay.trade.page.pay  alipay.trade.wap.pay
	const result = await alipaySdk.exec(
		'alipay.trade.page.pay',
		{},
		{ formData: formData }
	)

	ctx.body = `<a href="${result}">跳转到XXX页面</a>`
})

router.post('/paycallback', async (ctx, next) => {
	let postData = ctx.request.body;
	console.log("触发付款");
	if (postData.trade_status === "TRADE_SUCCESS") {
		let data = ctx.request.body // 订单信息
		// ========= 由请求体内的订单信息，在这里进行数据库中订单状态的更改 ============
		console.log("支付完成！");
	}
})
router.get('/success', async (ctx, next) => {
	ctx.body = "支付成功"
})

module.exports = router
