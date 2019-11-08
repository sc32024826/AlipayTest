const axios = require('axios');
const crypto = require('crypto');
const querystring = require('querystring')
// const mongoose = require('mongoose')
const express = require('../models/express')

const AppKey = '7041910f-beb5-4c60-b785-f2496a6dba6d';
const ReqURL = 'http://sandboxapi.kdniao.com:8080/kdniaosandbox/gateway/exterfaceInvoke.json';
const EBusinessID = 'test1536407';

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
    //即时查询只支持三家公司
    const company = [
        'YTO',
        'STO',
        'ZTO'
    ]

    let { ShipperCode, LogisticCode } = jsonobj;
    if (!company.includes(ShipperCode)) {
        throw new Error('即时查询只支持三家公司 圆通YTO 申通STO 中通ZTO');
    }
    if (!ShipperCode || !LogisticCode) {
        throw new Error('缺少必要参数');
    }
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
 * 轨迹信息订阅,每次信息改变时回调修改数据库信息
 * @returns 返回订阅的结果 boolean
 */
async function subscribe(obj) {
    //请求必须参数验证
    let { ShipperCode, LogisticCode, Sender, Receiver, Commodity } = obj;
    //订阅只支持 圆通 中通 申通 百世汇通 四家快递公司
    const company = [
        'YTO',
        'HTKY',
        'STO',
        'ZTO'
    ]

    if (!company.includes(ShipperCode)) {
        throw new Error("订阅失败,您输入的快递公司无法订阅!订阅目前只支持 '圆通' '中通' '申通' '百世汇通' 四家快递公司!");
    }
    if (!ShipperCode || !LogisticCode) {
        throw new Error('缺少必要参数');
    }
    if (!Sender.Name || !Sender.CityName || !Sender.Address || !Sender.ProvinceName || !Sender.ExpAreaName || !Sender.Mobile) {
        throw new Error('缺少必要参数');
    }
    if (!Receiver.Name || !Receiver.CityName || !Receiver.Address || !Receiver.ProvinceName || !Receiver.ExpAreaName || !Receiver.Mobile) {
        throw new Error('缺少必要参数');
    }

    Logistic = Object.assign({ PayType: 1 }, Logistic);

    console.log(Logistic);

    let requestData = JSON.stringify(Logistic);
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
async function expressInfoInput(order, logistic) {
    const { } = order;
    const { } = logistic;


}
// getOrderByJson({
//     ShipperCode: 'ZTO',
//     LogisticCode: '3100707578976'
// })
TODO: 方法还未验证
/**
 * 在快递鸟配置的回调地址的方法,用于接收回调 物流信息更新数据库
 * 
 */
async function callBack(data) {
    //根据快递鸟返回的物流信息物流单号,更新数据库
    let num = data.LogisticCode;

    await express.findOne({ LogisticCode: num }, (err, doc) => {
        //查询失败,说明该物流还未保存过,直接保存快递鸟回调数据
        if (err) {

            express.create(data, (error, doc) => {
                if (error) {
                    throw error;
                }
            })

        } else {  //反之存在,则更新
            express.updateOne({ LogisticCode: num }, (e, doc) => {
                if (e) {
                    throw e;
                }
            })
        }
    })

    let res = {
        'EBusinessID': EBusinessID,
        'UpdateTime': Data.now().toString(),
        'Success': true,
        'Reason': ''
    }
    return res


}
module.exports = {
    getOrderByJson,
    subscribe,
    expressInfoInput,
    callBack
};