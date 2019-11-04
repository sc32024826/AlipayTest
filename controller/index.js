// const fs = require('fs')
// const moment = require('moment')
// const crypto = require('crypto')
// const config = require('../config/alipay_setting').alipayConfig
// const SDK = require('alipay-sdk').default;
// const alipayFormData = require('alipay-sdk/lib/form').default
// const key = fs.readFileSync(config.APP_PRIVATE_KEY_PATH,'utf8')
// // console.log(key)
// const alipaySdk = new SDK({
//     appId: config.APP_ID,
//     privateKey: key,
//     gateway: "https://openapi.alipaydev.com/gateway.do"
// })

// const FormData = new alipayFormData()
// FormData.setMethod('get')
// FormData.addField('notifyUrl', '')
// FormData.addField('returnUrl', 'http://www.lzhb.site')
// FormData.addField('bizContent', {
//     outTradeNo: new Date().valueOf(),
//     producetCode: 'FAST_INSTANT_TRADE_PAY',
//     totalAmount: '88.88',
//     subject: 'iphone-xs',
//     body: '商品详情'
// })
// const result = alipaySdk.exec(
//     'alipay.trade.page.pay',
//     {},
//     {
//         formData: FormData,
//         validateSign: true
//     }
// )

// async function payDemo(ctx) {

//     ctx.body = result
// }



// // const JSON = require('JSON')
// /**
//  * 生成业务请求参数的集合
//  * @param subject       商品的标题/交易标题/订单标题/订单关键字等。
//  * @param outTradeNo    商户网站唯一订单号
//  * @param totalAmount   订单总金额，单位为元，精确到小数点后两位，取值范围[0.01,100000000]
//  * @returns {string}    json字符串
//  * @private
//  */
// async function index() {

//     let params = new Map()
//     params.set('app_id', '2016101200666016')
//     params.set("method", "alipay.trade.app.pay")
//     params.set("charset", "utf-8")
//     params.set("sign_type", "RSA2")
//     params.set("timestamp", moment().format('YYYY-MM-DD HH:mm:ss'))
//     params.set("version", "1.0")
//     params.set("notify_url", "")
//     params.set("biz_content", buildBiz_content('商品名称', '订单号00000001', '商品金额8.88'))

//     return params
// }
// function buildBiz_content(subject, out_trade_no, total_amount) {
//     let content = {
//         subject: subject,
//         out_trade_no: out_trade_no,
//         total_amount: total_amount,
//         product_code: 'QUICK_MSECURITY_PAY'
//     }
//     return JSON.stringify(content)
// }

// /**
//  * 根据参数构建签名
//  * @param paramsMap    Map对象
//  * @returns {number|PromiseLike<ArrayBuffer>}
//  * @private
//  */
// async function sign() {
//     let params = await index()
//     let list = [...params].filter(([k, v]) => k !== 'sign' && v)
//     list.sort()

//     let paramsString = list.map(([k, v]) => `${k}=${v}`).join('&')
//     console.log(paramsString)
//     let privateKey = fs.readFileSync(config.alipayConfig.APP_PRIVATE_KEY_PATH, 'utf-8')
//     let signType = params.get('sign_type')
//     return signWithKy(signType, paramsString, privateKey)
// }

// function signWithKy(type, String, key) {
//     let sign
//     if (type.toUpperCase() === 'RSA2') {
//         sign = crypto.createSign("RSA-SHA256")
//     } else if (type.toUpperCase() === 'RSA') {
//         sign = crypto.createSign("RSA-SHA1")
//     } else {
//         throw new Error("请传入正确的签名方式,Type:" + type)
//     }
//     sign.update(String)
//     return sign.sign(key, 'base64')
// }
const AlipaySdk = require('alipay-sdk').default;
const AlipayFormData = require('alipay-sdk/lib/form').default
const fs = require('fs')
const path = require('path')
const PRIVATE_KEY_PATH = path.join(__dirname, '../config/pem/APP_PRIVATE_KEY.pem')  //应用私钥
const PUBLIC_KEY_PATH = path.join(__dirname, '../config/pem/ALIPAY_PUBLIC_KEY.pem')  //支付宝公钥
const PRIVATE_KEY = fs.readFileSync(path.resolve(PRIVATE_KEY_PATH), 'utf8')
const PUBLIC_KEY = fs.readFileSync(path.resolve(PUBLIC_KEY_PATH), 'utf8')

module.exports = {
    payDemo,
    async pay(ctx){
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
    
        return result
    },
    async payback(ctx, next){
        let postData = ctx.request.body;
        console.log("触发付款");
        if (postData.trade_status === "TRADE_SUCCESS") {
            let data = ctx.request.body // 订单信息
            // ========= 由请求体内的订单信息，在这里进行数据库中订单状态的更改 ============
            console.log("支付完成！");
        }
    },
    async success(ctx, next){
        ctx.body = "支付成功"
    }
}