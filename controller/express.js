const axios = require('axios');
const crypto = require('crypto');
const md5 = crypto.createHash('md5');
const querystring = require('querystring')
const mongoose = require('mongoose')
const express = require('../models/express')

const AppKey = '7041910f-beb5-4c60-b785-f2496a6dba6d';
const ReqURL = 'http://sandboxapi.kdniao.com:8080/kdniaosandbox/gateway/exterfaceInvoke.json';
const EBusinessID = 'test1536407';

/**
 * 需要参数 
 * OrderCode 订单编号,不可重复,自定义  
 * ShipperCode快递公司编码 
 * LogisticCode快递单号
 * @param {*} ctx 
 */
async function getOrderTracesByJson(Logistic) {

    let { OrderCode, ShipperCode, LogisticCode } = Logistic;
    if (!ShipperCode || !LogisticCode) {
        throw ('缺少必要参数');
    }
    let requestData = JSON.stringify(Logistic);
    let DataSign = encrypt(requestData, AppKey);
    // console.log("签名" + DataSign);
    let PostData = querystring.stringify(
        {
            RequestData: requestData,
            EBusinessID,
            RequestType: '1008',
            DataSign,
            DataType: '2'
        }
    )
    // console.log("post数据" + PostData);
    const res = await axios({
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        },
        method: 'POST',
        url: ReqURL,
        data: PostData,
    }).catch(err => {
        console.log('err:', err);
        throw err;
    });
    // console.log(res.data);
    return res.data;
}
/*
* 电商sign 签名生成
* @param data 内容
* @param appkey AppKey
* @return DataSign签名
*/
function encrypt(data, appkey) {
    let md5 = crypto.createHash('md5');
    return Buffer.from(md5.update(data + appkey).digest('hex')).toString('base64');
}
/**
 * 填写物流单号等信息,选择订单,添加物流信息
 * @param order json 订单信息: 商品信息R等
 * @param logistic json 物流信息:由前台输入物流单号R,快递公司R,收件人信息R,发件人信息R,等
 */
async function expressInfoInput(order,logistic){
    const {} = order;
    const {} = logistic;


} 
getOrderTracesByJson(
    {
        OrderCode: 'SF201608081055208281',
        ShipperCode: 'YTO',
        LogisticCode: '3100707578976',
        PayType:1,
        ExpType:1,
        IsNotice:0,
        Cost:1.0,
        OtherCost:1.0,
        Sender:{
            Company:'LV',
            Name:'Taylor',
            Mobile:'15018442396',
            ProvinceName:'上海',
            CityName:'上海',
            ExpAreaName:'青浦区',
            Address:'明珠路73号'
        },
        Receiver:{
            Company:'GCCUI',
            Name:'Yann',
            Mobile:'15018442396',
            ProvinceName:'北京',
            CityName:'北京',
            ExpAreaName:'朝阳区',
            Address:'三里屯街道雅秀大厦'
        },
        Commodity:[{
            GoodsName:'鞋子',
            Goodsquantity:1,
            GoodsWeight:1.0
        }],
        Weight:1.0,
        Quantity:1,
        Volume:0.0,
        Remark:'小心轻放'
    }
)

module.exports = {
    getOrderTracesByJson,
    expressInfoInput
};