const axios = require("axios");
const crypto = require("crypto");
const querystring = require("querystring");
const config = require("../config/kuaidiniao");
const { AppKey, ReqURL, EBusinessID } = config;


/**
 * 即时查询
 * 需要参数
 * OrderCode 订单编号,不可重复,自定义
 * ShipperCode快递公司编码 即时查询只支持三家公司 圆通YTO 申通STO 中通ZTO
 * LogisticCode快递单号
 * @param jsonObj {Object} 必须参数:ShipperCode-快递公司编码,LogisticCode-快递单号
 * @returns {Object} data.success true-有轨迹 false-无轨迹
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
    return Buffer.from(md5.update(data + AppKey).digest("hex")).toString("base64");
}

/**
 * 轨迹信息订阅,每次信息改变时回调修改数据库信息
 * @returns 返回订阅的结果 boolean
 */
async function subscribe(obj) {

    obj = Object.assign({ PayType: 1 }, obj);

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
 * 
 * @param {Object} ctx 
 */
async function TracesWatch(ctx) {
    let requestData = JSON.stringify(ctx.request.body);
    let DataSign = encrypt(requestData, AppKey);
    // console.log("签名" + DataSign);
    let PostData = querystring.stringify({
        RequestData: requestData,
        EBusinessID,
        RequestType: 101,
        DataSign,
        DataType: "2"
    });
    // console.log("post数据" + PostData);
    console.log(PostData);

    const res = await axios({
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        },
        method: "POST",
        url: ReqURL,
        data: PostData
    }).catch(err => {
        console.log("err:", err);

        ctx.body = {
            Msg: "出错",
            Success: false
        }
        throw err;
    });

    if (res) {
        console.log(res.request);
        ctx.body = {
            Msg: "成功",
            Success: true
        }

    }
}

module.exports = {
    getOrderByJson,
    subscribe,
    TracesWatch
};
