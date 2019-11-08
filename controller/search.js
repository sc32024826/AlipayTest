const M_express = require('../models/express')
const express = require('./express')

/**
 * @param json 需要至少携带4个参数
 * ShipperCode:快递公司编码
 * LogisticCode:快递单号
 * Sender 寄件人对象,子参数 Name,Mobile,ProvinceName,CityName,ExpAreaName,Address
 * Receiver 收件人对象 子参数同上
 */
async function search(ctx) {
    let req = ctx.query
    // console.log(req);
    // console.log(req.ShipperCode)
    // return
    let { ShipperCode, LogisticCode } = req;
    if (!ShipperCode || !LogisticCode) {
        throw new Error("1.参数错误");
    }
    //查找数据库中是否存在该物流单号
    await M_express.findOne({ LogisticCode: LogisticCode },'Traces', (error, doc) => {
        if (error) {
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
                express.subscribe(json)
            } catch (err) {
                throw (err)
            }
            console.log(result);

            return result
        } else {
            //已经订阅,直接返回数据库中的轨迹
            // doc.Trace.map((s)=>console.log(s))
            TODO: "已经返回 doc 如何获取doc中的数组 Traces"

            console.log(doc);
            // return doc.Traces
        }
    })

}

module.exports = {
    search
}