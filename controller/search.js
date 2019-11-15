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

    console.log('ShipperCode:' + ShipperCode);
    console.log('LogisticCode:' + LogisticCode);

    //查找数据库中是否存在该物流单号
    await Model.findOne({ ShipperCode: ShipperCode, LogisticCode: LogisticCode }, { Traces: 1 }, (e, doc) => {

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
                let res = order(req)
                ctx.body = {
                    result: res
                }
                return
            }
            //查询并订阅
            OrderSave(ctx)
        }
    })

}
async function OrderSave(ctx) {
    var req = ctx.request.body;
    let { ShipperCode, LogisticCode } = req;
    //即时查询
    let data = await express.getOrderByJson({
        ShipperCode,
        LogisticCode
    }).catch((e) => {
        console.log(e);
        ctx.body = {
            error: e
        }
        return

    });

    //保存即时查询的值
    let res = await saveData(data);
    //订阅
    let bool = await express.subscribe(req).catch((e) => {
        console.log(e);
        ctx.body = {
            error: e
        }
        return
    });
    ctx.body = {
        list: data.Traces,
        result: res,
        bool: bool
    };
}
/**
 * 将即时查询的数据保存到数据库 以便后续查询和更新
 * @param {Object} data 即时查询返回的结果
 */
async function saveData(data) {

    //存储查询结果
    await Model.create(data, (err, document) => {
        if (document) {
            return "保存成功";
        } else {
            return "保存失败";
        }
    })
}


module.exports = {
    search
}