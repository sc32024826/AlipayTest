const config = require('../config/express')
const axios = require('axios')
const crypto = require('crypto')
const md5 = crypto.createHash('md5')
const { base64encode } = require('nodejs-base64')
const URL = require('url')
const urlencode = require('urlencode')
const JSON = require('JSON')

/**
 * 
 * @param {*} ctx 
 */
async function getOrderTracesByJson() {
    //OrderCode订单编号,不可重复,自定义  ShipperCode快递公司编码 LogisticCode快递单号
    let requestData = "{'OrderCode':'','ShipperCode':'YTO','LogisticCode':'12345678'}"
    // console.log(urlencode(requestData).replace(/\'/g,'%27'));
    let datas = new Map()
    datas.set('EBusinessID', config.EBusinessID) //用户ID      
    datas.set('RequestType', '1002')          //请求指令类型
    datas.set('RequestData', urlencode(requestData).replace(/\'/g, '%27'))   //数据内容 编码UTF-8  正则匹配 所有单引号 修改为 %27
    datas.set('DataType', '2')                            //返回数据为json
    datas.set('DataSign', encrypt(requestData, config.AppKey))
    // console.log("datas length");
    // console.log(datas.get('RequestData'))        
    // console.log(datas.get('DataSign'))   
    let result = await sendPost(config.ReqURL, datas)

    return result
}
/*
* 电商sign 签名生成
* @param data 内容
* @param appkey AppKey
* @return DataSign签名
*/
function encrypt(data, appkey) {
    console.log("-------encrypt-------")
    res = encodeURIComponent(base64encode(md5.update(data + appkey).digest('hex')))
    console.log(res);
    console.log("----end encrypt------")
    return res
}

/**
 * 
 * @param {*} ReqURL 请求地址
 * @param {*} datas 
 */
async function sendPost(ReqURL, datas) {
    /*
    // http://sandboxapi.kdniao.com:8080/kdniaosandbox/gateway/exterfaceInvoke.json
    //第一步 需要将datas 请求信息 修改成 key=value形式的字符串
    */
    // 实际请求url : sandboxapi.kdniao.com:8080
    let url = URL.parse(ReqURL)['host']
    // console.log(typeof datas);
    let req = ""
    datas.forEach((data, index) => {
        req = req + index + "=" + data + "&"
    })
    let re = req.replace(/.$/, '')  //删除最后一个$ 符号
    console.log(re);

    axios({
        url: url,
        method: 'POST',
        data: {
            /*  key value 形式
            EBusinessID:'test1536407',
            RequestType:'1002',
            RequestData:'%7B%27OrderCode%27%3A%27%27%2C%27ShipperCode%27%3A%27YTO%27%2C%27',
            LogisticCode:'%27%3A%2712345678%27%7D',
            DataType:'2',
            DataSign:'YThhN2VjNzllZDdiMmExZTdlN2MxNThlOTg3MTgzOWQ%3D'
            */
            datas
        },
        headers: {
            // "user-agent": "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1;SV1)",
            'Content-Type': 'application/x-www-form-urlencoded',
            // 'Content-Length': ,
            'Connection': 'close'
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