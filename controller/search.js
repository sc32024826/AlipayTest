const M_express = require('../models/express')
const express = require('./express')

/**
 * @param json 需要至少携带4个参数
 * ShipperCode:快递公司编码
 * LogisticCode:快递单号
 * Sender 寄件人对象,子参数 Name,Mobile,ProvinceName,CityName,ExpAreaName,Address
 * Receiver 收件人对象 子参数同上
 * @return 返回对象为 轨迹数组
 */
async function search(ctx) {
    //GET 还是 POST
    console.log(ctx.method)
    if (ctx.method === 'GET') {
        var req = ctx.query
        console.log(req);

    } else if (ctx.method === 'POST') {
        var req = ctx.request.body
    }
    let { ShipperCode, LogisticCode } = req;
    if (!ShipperCode || !LogisticCode) {
        throw new Error("1.参数错误");
    }

    //查找数据库中是否存在该物流单号
    await M_express.findOne({ LogisticCode: LogisticCode }, { Traces: 1 }, (error, doc) => {
        if (error) {
            console.log("未订阅");
            
            //如果查询失败,说明当前数据库中不存在物流信息 ,需要订阅
            //先查询即时物流
            let result = express.getOrderByJson({
                ShipperCode,
                LogisticCode
            });
            // console.log(result);
            //存储查询结果
            M_express.create(result, (err, document) => {
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
                console.log("订阅");
                
                express.subscribe(json)
            } catch (err) {
                throw err
            }
            console.log(result);

            return result
        } else {
            console.log("已经订阅,直接返回当前轨迹");
            
            //已经订阅,直接返回数据库中的轨迹 目前返回类型为 数组
            // let res = JSON.stringify(doc._doc.Traces)
            // console.log(res)
            // return doc._doc.Traces
            ctx.body = {
                list: doc._doc.Traces
            }
        }
    })

}

module.exports = {
    search
}