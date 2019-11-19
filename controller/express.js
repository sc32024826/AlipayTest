const axios = require("axios");
const crypto = require("crypto");
const querystring = require("querystring");
const moment = require("moment");
const config = require("../config/kuaidiniao");
const {AppKey, ReqURL, EBusinessID} = config;
const service = require('../service/index');

/**
 * 即时查询
 * 需要参数
 * OrderCode 订单编号,不可重复,自定义
 * ShipperCode快递公司编码 即时查询只支持三家公司 圆通YTO 申通STO 中通ZTO
 * LogisticCode快递单号
 * @param jsonObj 必须参数:ShipperCode-快递公司编码,LogisticCode-快递单号
 * @returns data.success true-有轨迹 false-无轨迹
 */
async function getOrderByJson(jsonObj) {
    let requestData = JSON.stringify(jsonObj);
    let DataSign = encrypt(requestData, AppKey);
    // console.log("签名" + DataSign);
    let PostData = querystring.stringify({
        RequestData: requestData,
        EBusinessID,
        RequestType: 1002,
        DataSign,
        DataType: "2"
    });
    // console.log("post数据" + PostData);
    const res = await axios({
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        },
        method: "POST",
        url: ReqURL,
        data: PostData
    }).catch(err => {
        console.log("err:", err);
        throw err;
    });

    // console.log(res.data);

    return res.data;
}

/**
 * 电商sign 签名生成
 * @param data 内容
 * @param AppKey AppKey
 * @return string
 */
function encrypt(data, AppKey) {
    let md5 = crypto.createHash("md5");
    return Buffer.from(md5.update(data + AppKey).digest("hex")).toString(
        "base64"
    );
}

/**
 * 轨迹信息订阅,每次信息改变时回调修改数据库信息
 * @returns 返回订阅的结果 boolean
 */
async function subscribe(obj) {

    obj = Object.assign({PayType: 1}, obj);

    let requestData = JSON.stringify(obj);
    let DataSign = encrypt(requestData, AppKey);
    // console.log("签名" + DataSign);
    let PostData = querystring.stringify({
        RequestData: requestData,
        EBusinessID,
        RequestType: 1008,
        DataSign,
        DataType: "2"
    });
    // console.log("post数据" + PostData);
    const res = await axios({
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        },
        method: "POST",
        url: ReqURL,
        data: PostData
    }).catch(err => {
        console.log("err:", err);
        throw err;
    });
    console.log(res.data);
    return res.data.Success; //返回订阅结果
}

/**
 * 在快递鸟配置的回调地址的方法,用于接收回调 物流信息更新数据库
 * 请求方式POST,"Content-Type": "application/json;charset=utf-8"
 */
async function callBack(ctx) {
    //根据快递鸟返回的物流信息物流单号,更新数据库
    //首先获取POST的数据
    let post_params = ctx.request.body;
    // console.log(post_params);
    // console.log(typeof post_params);
    // 获取物流单号轨迹的数组
    let data = post_params.Data;
    // console.log(post_params.Data);

    let res = {
        EBusinessID: EBusinessID,
        UpdateTime: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        Success: true,
        Reason: ""
    };
    ctx.body = {
        res: res
    };
    await data.forEach(element => {
        //根据物流单号 查询数据库 并修改相应的轨迹信息
        //如果物流单号不存在 则不更新
        try{
            service.update(element)
        }catch (e) {
            console.log(e)
        }
    });
}

module.exports = {
    getOrderByJson,
    subscribe,
    callBack
};
