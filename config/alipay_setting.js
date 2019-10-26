const path = require('path')
const fs = require('fs')

let alipayConfig = {
    APP_ID: "2016101200666016",
    APP_GATEWAY_URL: 'xxxxxxx',//用于接收支付宝异步通知
    //第三方授权或用户信息授权后回调地址。授权链接中配置的redirect_uri的值必须与此值保持一致。
    AUTH_REDIRECT_URL: 'xxxxxxx',
    APP_PRIVATE_KEY_PATH: path.join(__dirname, 'pem', 'private.pem'),//应用私钥
    APP_PUBLIC_KEY_PATH: path.join(__dirname, 'pem', 'public.pem'),//应用公钥
    ALI_PUBLIC_KEY_PATH: path.join(__dirname, 'pem', 'remind', 'sandbox', 'ali-public.pem'),//阿里公钥
    AES_PATH: path.join(__dirname, 'pem', 'remind', 'sandbox', 'aes.txt'),//aes加密（暂未使用）
}
module.exports = {
    alipayConfig
}