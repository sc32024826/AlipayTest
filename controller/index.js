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
    const company = ['YTO', 'STO', 'ZTO'];

    if (!company.includes(ShipperCode.toUpperCase())) {
        console.log('只支持三家公司 圆通YTO 申通STO 中通ZTO');
        ctx.body = {
            err: "目前只支持三家公司 圆通YTO 申通STO 中通ZTO"
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
    //首先根据物流单号和公司编号 查询数据库，是否存在相应内容
    try {
        //如果存在，则直接返回该单号的物流信息
        let res = await service.find(ShipperCode, LogisticCode);
        ctx.body = {
            List: res.Traces,
            Success: true,
            State: res.State
        }
    } catch (e) {
        //否则 执行即时查询功能
        let data = await express.getOrderByJson({
            ShipperCode,
            LogisticCode
        }).catch((err) => {
            console.log(err);
            ctx.body = {
                Err: err,
                Success: false
            }
        });

        //查询成功 返回相应的值
        ctx.body = {
            Success: true,
            State: data.State,
            List: data.Traces
        };

        //保存查询结果
        await service.save(data)
    }
}

/**
 * 订阅
 * @param ctx
 * @returns {Promise<void>}
 */
async function sub(ctx) {

    //请求必须参数验证
    let {ShipperCode, LogisticCode, State} = ctx.request.body;
    if (State === '3' || State === '4') {
        ctx.body = {
            Err: "该快递状态不支持订阅，已签收或者出错！",
            Success: false
        };
        return
    }
    //不想给快递鸟 收集个人信息，直接以虚假信息覆盖
    let privateInfo = {
        PayType: 1,
        Sender: {
            Name: "11",
            Tel: "",
            Mobile: "12345678911",
            ProvinceName: "广东省",
            CityName: "广州市",
            ExpAreaName: "白云区",
            Address: "紫金港"
        },
        Receiver: {
            Name: "12",
            Tel: "",
            Mobile: "88888888888",
            ProvinceName: "江苏省",
            CityName: "苏州市",
            ExpAreaName: "扬州区",
            Address: "你家隔壁"
        }
    };

    let req = Object.assign({ShipperCode, LogisticCode}, privateInfo);
    try {
        let res = await express.subscribe(req);
        ctx.body = {
            Success: res
        }
    } catch (err) {
        console.log(err);
        ctx.body = {
            Err: err,
            Success: false
        }
    }

}

module.exports = {
    search,
    sub
};