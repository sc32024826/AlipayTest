const express = require('./express');
const service = require('../service/index');

/**
 * 首先 通过ctx 获取 请求参数,查询数据库是否存在物流的相应轨迹信息,若不存在,则订阅
 * @param {*} ctx 由于使用次数限制,应当包含收寄人详细信息
 */
async function search(ctx) {

    const req = ctx.request.body;
    let {ShipperCode, LogisticCode} = req;
    //圆通 中通 申通 百世汇通 四家快递公司
    const company = ['YTO', 'HTKY', 'STO', 'ZTO'];

    if (!company.includes(ShipperCode.toUpperCase())) {
        console.log('只支持三家公司 圆通YTO 申通STO 中通ZTO');
        ctx.body = {
            err: "目前只支持三家公司 圆通YTO 申通STO 中通ZTO 百世汇通HTKY"
        };
        return
    }
    if (!ShipperCode || !LogisticCode) {
        ctx.body = {
            err: "400, 参数错误"
        };
        return
    }

    console.log('ShipperCode:' + ShipperCode);
    console.log('LogisticCode:' + LogisticCode);

    let find = await service.find(ShipperCode, LogisticCode);
    if (find.doc) {
        let Traces = find.doc._doc.Traces;
        console.log("已经订阅,直接返回当前轨迹");
        console.log(Traces);
        //已经订阅,直接返回数据库中的轨迹 目前返回类型为 数组
        ctx.body = {
            list: Traces
        }
    } else {

        console.log("查找失败");
        //如果查询失败,说明当前数据库中不存在物流信息 ,需要订阅
        if (ShipperCode === "HTKY") {
            //百世汇通直接订阅不查询
            let res = await express.subscribe(req)
                .catch((e) => {
                    console.log(e);
                    throw e;
                });
            ctx.body = {
                order: res
            };
            return
        }
        //查询并订阅
        //即时查询
        let data = await express.getOrderByJson({
            ShipperCode,
            LogisticCode
        }).catch((e) => {
            console.log(e);
            throw e;
        });


        //订阅
        let bool = await express.subscribe(req).catch((e) => {
            console.log(e);
            ctx.body = {
                err: e
            }
        });
        ctx.body = {
            list: data.Traces,
            order: bool
        };
    }
}

module.exports = {
    search
}