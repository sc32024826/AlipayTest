const express = require('./express');
const Model = require('../models/express');
const privacy = require('../utils/privacy')
const log4js = require('log4js')
log4js.configure({
    appenders: { cheese: { type: 'file', filename: '../log/cheese.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger('cheese')

/**
 * 查询 并 订阅
 * @param {Object} ctx 
 */
async function findWithSub(ctx) {
    const req = ctx.request.body;
    let { ShipperCode, LogisticCode } = req;

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
    //首先根据物流单号和公司编号 查询数据库，是否存在相应内容
    try {
        //如果存在，则直接返回该单号的物流信息
        let res = await Model.findOne({ ShipperCode, LogisticCode }, { Traces: 1, State: 1, Sub: 1 });

        //返回轨迹信息之后 再检查 是否已经订阅,若否 则订阅
        console.log(res);
        if (res) {

            if (res.Sub) {
                console.log("存在记录且已经订阅");
                //直接返回数据
                ctx.body = {
                    List: res.Traces,
                    Success: true,
                    State: res.State,
                    Sub: true
                }
            } else {
                console.log("存在记录 但是没订阅");
                //订阅 并更新数据库
                let req = await privacy.index(ShipperCode, LogisticCode);
                //开始订阅
                var result = await express.subscribe(req);

                //查询成功 返回相应的值
                ctx.body = {
                    Success: true,
                    State: data.State,
                    List: data.Traces,
                    Sub: result
                };

                //更新数据库
                let updateResult = await Model.updateOne({ ShipperCode, LogisticCode }, { Sub: result })

                console.log(updateResult);                

            }
        } else {
            //查询 保存 并订阅
            console.log("不存在记录");
            let data = await express.getOrderByJson({
                ShipperCode,
                LogisticCode
            }).catch((err) => {
                console.log(err);
                ctx.body = {
                    Err: err,
                    Success: false
                }
                return
            });
            let req = await privacy.index(ShipperCode, LogisticCode);
            //开始订阅
            var result = await express.subscribe(req);

            //查询成功 返回相应的值
            ctx.body = {
                Success: true,
                State: data.State,
                List: data.Traces,
                Sub: result
            };
            console.log(data);

            data.Sub = result;
            console.log(data);
            //保存查询结果 错误时记录日志
            await Model.create(data).catch(e){
                console.log("保存失败");

            }
        }
    } catch (e) {
        console.log("报错:" + e);
    }

}

module.exports = {
    findWithSub
}