const M_express = require('../models/express')
const express = require('./express')

/**
 * 首先 通过ctx 获取 请求参数,查询数据库是否存在物流的相应轨迹信息,若不存在,则订阅
 * @param {*} ctx 由于使用次数限制,应当包含收寄人详细信息
 */
async function search(ctx) {
    //GET 还是 POST
    if (ctx.method === 'GET') {
        var req = ctx.query;
    } else if (ctx.method === 'POST') {
        var req = ctx.request.body
    }
    let { ShipperCode, LogisticCode } = req;
    if (!ShipperCode || !LogisticCode) {
        throw new Error("1.参数错误");
    }
    console.info("ShipperCode:" + ShipperCode);
    console.info("LogisticCode:" + LogisticCode);
    //查找数据库中是否存在该物流单号
    await M_express.findOne({ 'ShipperCode': ShipperCode, 'LogisticCode': LogisticCode }, { 'Traces': 1 }, (error, doc) => {

        if (error) {
            findAndOrder(ShipperCode, LogisticCode, ctx)

        } else if (doc) {
            console.info("已经订阅,直接返回当前轨迹");
            //已经订阅,直接返回数据库中的轨迹 目前返回类型为 数组
            ctx.body = {
                list: doc._doc.Traces
            }
        } else {
            console.info('没有报错也没有搜索到数据');

            findAndOrder(ShipperCode, LogisticCode, ctx)
        }
    })
}

/**
 * 未在数据库中发现相应记录,请求查询并订阅该物流号的轨迹信息
 * tips:不到为什么 使用findone查找时会遇到 回调参数 err和doc 同时为null这种情况
 * @param {String} ShipperCode 
 * @param {String} LogisticCode 
 * @param {*} ctx 
 */
async function findAndOrder(ShipperCode, LogisticCode, ctx) {
    console.info("查询失败");

    //如果查询失败,说明当前数据库中不存在物流信息 ,需要订阅
    //先查询即时物流
    try {
        var result = await express.getOrderByJson({
            ShipperCode,
            LogisticCode
        });
    } catch (e) {
        console.log("查询物流单号时出错:" + e);
        ctx.body = e;
        return
    }

    //存储查询结果
    await M_express.create(result, (err, document) => {
        if (err) {
            console.log("保存失败");
            throw err;
        } else {
            console.log("保存成功");
            console.log(document);
        }
    })
    //再订阅
    try {
        console.info("订阅");
        let bool = express.subscribe(ctx.query)
        if (bool) {
            console.log('订阅成功');
        } else {
            console.log('订阅失败')
        }
    } catch (err) {
        ctx.body = err;
        return
    }
    // console.log(result);

    ctx.body = {
        'res': result,
        'bool': bool
    }
}

module.exports = {
    search
}