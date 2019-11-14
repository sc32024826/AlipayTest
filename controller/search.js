const Model = require('../models/express')
const express = require('./express')

/**
 * 首先 通过ctx 获取 请求参数,查询数据库是否存在物流的相应轨迹信息,若不存在,则订阅
 * @param {*} ctx 由于使用次数限制,应当包含收寄人详细信息
 */
async function search(ctx) {
    //GET 还是 POST
    if (ctx.method === 'GET') {
        ctx.body = {
            error: "请使用POST方式提交"
        }
        return
    }
    var req = ctx.request.body;
    let { ShipperCode, LogisticCode } = req;
    //圆通 中通 申通 百世汇通 四家快递公司
    const company = ['YTO', 'HTKY', 'STO', 'ZTO'];

    if (!company.includes(ShipperCode.toUpperCase())) {
        console.log('只支持三家公司 圆通YTO 申通STO 中通ZTO');
        ctx.body = {
            error: "目前只支持三家公司 圆通YTO 申通STO 中通ZTO 百世汇通HTKY"
        }
        return
    }
    if (!ShipperCode || !LogisticCode) {
        ctx.body = {
            err: "400, 参数错误"
        }
        return
    }
    //查找数据库中是否存在该物流单号
    Model.findOne({ 'ShipperCode': ShipperCode, 'LogisticCode': LogisticCode }, { 'Traces': 1 }, (e, doc) => {

        if (doc) {
            console.log("已经订阅,直接返回当前轨迹");
            console.log(doc._doc.Traces);

            //已经订阅,直接返回数据库中的轨迹 目前返回类型为 数组
            ctx.body = {
                list: doc._doc.Traces
            }
        } else {
            console.log("查找失败");
            //如果查询失败,说明当前数据库中不存在物流信息 ,需要订阅
            if (ShipperCode === "HTKY") {
                //百世汇通直接订阅不查询
                try {
                    var bool = express.subscribe(req)
                    if (bool) {
                        ctx.body = {
                            message: "百世汇通目前不支持物流查询,已帮你跟踪物流,后续物流变动后可查询"
                        }
                    } else {
                        ctx.body = {
                            message: "订阅失败"
                        }
                    }
                } catch (err) {
                    ctx.body = {
                        err: err
                    }
                    return
                }
                return
            }

            express.getOrderByJson({
                ShipperCode,
                LogisticCode
            }).then((data) => {
                // console.log(data);
                //存储查询结果
                Model.create(data, (err, document) => {
                    if (err) {
                        console.log("保存失败");
                    } else {
                        console.log("保存成功");
                        console.log(document);
                    }
                })
                //再订阅
                try {
                    console.info("订阅");
                    var success = express.subscribe(req)
                    if (success) {
                        console.log('订阅成功');
                    } else {
                        console.log('订阅失败')
                    }
                } catch (e) {
                    ctx.body = {
                        err: e
                    }
                    return
                }
                console.log(data);
                console.log(success);
                
                
                ctx.body = {
                    'res': data,
                    'bool': success
                }
            }).catch((error) => {
                ctx.body = {
                    err: error
                }
            })
        }
    })
}

module.exports = {
    search
}