const config = require('../config/express')
const axios = require('axios')
const crypto = require('crypto')
const md5 = crypto.createHash('md5')
const { base64encode } = require('nodejs-base64')
const URL = require('url')

/**
 * 
 * @param {*} ctx 
 */
async function getOrderTracesByJson() {
    //OrderCode订单编号,不可重复,自定义  ShipperCode快递公司编码 LogisticCode快递单号
    let requestData = "{'OrderCode':'','ShipperCode':'YTO','LogisticCode':'12345678'}"

    let datas = new Map()
    datas.set('EBusinessID', config.EBusinessID) //用户ID      
    datas.set('RequestType', '1002')          //请求指令类型
    datas.set('RequestData', encodeURI(requestData))   //数据内容 编码UTF-8
    datas.set('DataType', '2')                            //返回数据为json
    datas.set('DataSign', encrypt(requestData, config.AppKey))
    // console.log("datas length");

    // console.log(datas.length);

    let result = sendPost(config.ReqURL, datas)

    return result
}
/*
* 电商sign 签名生成
* @param data 内容
* @param appkey AppKey
* @return DataSign签名
*/
function encrypt(data, appkey) {
    let str = md5.update(data + appkey).digest('hex')
    let base = base64encode(str)
    return encodeURIComponent(base)
}
/**
 * 
 * @param {*} ReqURL 请求地址
 * @param {*} datas 
 */
function sendPost(ReqURL, datas) {
    /*
    // http://sandboxapi.kdniao.com:8080/kdniaosandbox/gateway/exterfaceInvoke.json
    //第一步 需要将datas 请求信息 修改成 key=value形式的字符串
    */
    let url = URL.parse(ReqURL)['host']
    // console.log(URL.parse(ReqURL));

    axios({
        url: url,
        method: 'POST',
        data: {
            datas
        },
        headers: {
            // "user-agent": "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1;SV1)",
            'Content-Type': 'application/x-www-form-urlencoded',
            // 'Content-Length': ,
            'Connection': 'close',
            // "accept": "*/*"
        }

    }).then(res => {
        console.log('res:' + res);

    }).catch(error => {
        console.log('e:' + error);

    })
}

module.exports = {
    getOrderTracesByJson
}