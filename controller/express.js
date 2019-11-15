const axios = require('axios');
const crypto = require('crypto');
const querystring = require('querystring')
const express = require('../models/express')
const moment = require('moment')
//沙箱测试
// const AppKey = '7041910f-beb5-4c60-b785-f2496a6dba6d';   
// const ReqURL = 'http://sandboxapi.kdniao.com:8080/kdniaosandbox/gateway/exterfaceInvoke.json';  
// const EBusinessID = 'test1536407';   

//正式
const AppKey = '54ae50cc-6251-426f-a415-8880f9f1defa';      
const ReqURL = 'http://api.kdniao.com/Ebusiness/EbusinessOrderHandle.aspx'; 
const EBusinessID = '1536407';  

/**
 * 即时查询
 * 需要参数 
 * OrderCode 订单编号,不可重复,自定义  
 * ShipperCode快递公司编码 即时查询只支持三家公司 圆通YTO 申通STO 中通ZTO
 * LogisticCode快递单号
 * @param jsonobj 必须参数:ShipperCode-快递公司编码,LogisticCode-快递单号
 * @returns data.success true-有轨迹 false-无轨迹
 */
async function getOrderByJson(jsonobj) {

    let requestData = JSON.stringify(jsonobj);
    let DataSign = encrypt(requestData, AppKey);
    // console.log("签名" + DataSign);
    let PostData = querystring.stringify(
        {
            RequestData: requestData,
            EBusinessID,
            RequestType: 1002,
            DataSign,
            DataType: '2'
        }
    );
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
 * 轨迹信息订阅,每次信息改变时回调修改数据库信息
 * @returns 返回订阅的结果 boolean
 */
async function subscribe(obj) {

    //请求必须参数验证
    let { Sender, Receiver } = obj;

    if (!Sender.Name || !Sender.CityName || !Sender.Address || !Sender.ProvinceName || !Sender.ExpAreaName || !Sender.Mobile) {
        throw ('400,缺少必要参数 99');
    }
    if (!Receiver.Name || !Receiver.CityName || !Receiver.Address || !Receiver.ProvinceName || !Receiver.ExpAreaName || !Receiver.Mobile) {
        throw ('400,缺少必要参数 102');
    }

    obj = Object.assign({ PayType: 1 }, obj);

    let requestData = JSON.stringify(obj);
    let DataSign = encrypt(requestData, AppKey);
    // console.log("签名" + DataSign);
    let PostData = querystring.stringify(
        {
            RequestData: requestData,
            EBusinessID,
            RequestType: 1008,
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
    console.log(res.data);
    return res.data.Success;    //返回订阅结果

}
/**
 * 填写物流单号等信息,选择订单,添加物流信息
 * @param order json 订单信息: 商品信息R等
 * @param logistic json 物流信息:由前台输入物流单号R,快递公司R,收件人信息R,发件人信息R,等
 */
// async function expressInfoInput(order, logistic) {
//     const { } = order;
//     const { } = logistic;


// }
/**
 * 在快递鸟配置的回调地址的方法,用于接收回调 物流信息更新数据库
 * 请求方式POST,"Content-Type": "application/json;charset=utf-8"
 */
async function callBack(ctx) {
    //根据快递鸟返回的物流信息物流单号,更新数据库
    //首先获取POST的数据
    let post_params = ctx.request.body
    // console.log(post_params);
    // console.log(typeof post_params);
    // 获取物流单号轨迹的数组
    let data = post_params.Data
    // console.log(post_params.Data);

    let res = {
        'EBusinessID': EBusinessID,
        'UpdateTime': moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
        'Success': true,
        'Reason': ''
    }
    ctx.body = {
        'res': res
    }
    await data.forEach(element => {
        let { LogisticCode, ShipperCode, Traces } = element;

        //根据物流单号 查询数据库 并修改相应的轨迹信息
        //如果物流单号不存在 则不更新
        express.updateOne({ 'LogisticCode': LogisticCode, 'ShipperCode': ShipperCode }, { 'Traces': Traces }, (e, raw) => {
            if (e) {
                console.log("更新失败:" + e);
                throw e;
            } else {
                console.log("更新成功" + raw);
            }

        })
    });


}
module.exports = {
    getOrderByJson,
    subscribe,
    callBack
};