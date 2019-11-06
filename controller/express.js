const axios = require('axios');
const crypto = require('crypto');
const md5 = crypto.createHash('md5');
const querystring = require('querystring')

const AppKey = '7041910f-beb5-4c60-b785-f2496a6dba6d';
const ReqURL = 'http://sandboxapi.kdniao.com:8080/kdniaosandbox/gateway/exterfaceInvoke.json';

async function getOrderTracesByJson(params) {
    //OrderCode订单编号,不可重复,自定义  ShipperCode快递公司编码 LogisticCode快递单号
    // let requestData = ""
    let {OrderCode,ShipperCode,LogisticCode} = params;

    let data = {
        OrderCode,
        ShipperCode,
        LogisticCode
    }
    const EBusinessID = 'test1536407' ;

    let requestData = JSON.stringify(data);

    let DataSign = encrypt(requestData, AppKey);
    
    console.log("签名" +DataSign);

    let PostData = querystring.stringify(
        {
            RequestData: requestData,
            EBusinessID,
            RequestType: '1002',            
            DataSign,
            // DataType: '2'

        }
    )
    console.log("post数据" + PostData);

    const res = await axios({
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        },
        method: 'POST',
        url: ReqURL,
        data:PostData,
    }).catch(err => {
        console.log('err:', err);
        throw err;
    });

}
/*
* 电商sign 签名生成
* @param data 内容
* @param appkey AppKey
* @return DataSign签名
*/
function encrypt(data, appkey) {
    let c = md5.update(data + appkey).digest('hex')
    let a = Buffer.from(c).toString('base64');
    // let b = encodeURI((c).toString('base64'));
    // console.log("a:" + a);
    // console.log("b:" + b);
    return a
}

getOrderTracesByJson(
    {
        OrderCode:'',
        ShipperCode:'YTO',
        LogisticCode:'12345678'
    }
)

module.exports = {
    getOrderTracesByJson
};