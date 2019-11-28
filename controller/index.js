const express = require('./express');
const Model = require('../models/express');
const config = require("../config/kuaidiniao");
const { EBusinessID } = config;
const moment = require("moment");
const privacy = require('../utils/privacy')
const log4js = require('../utils/log4js');

/**
 * 首先 通过ctx 获取 请求参数,查询数据库是否存在物流的相应轨迹信息,若不存在,则订阅
 * @param {*} ctx 由于使用次数限制,应当包含收寄人详细信息
 */
async function search(ctx) {

    const req = ctx.request.body;
    let { ShipperCode, LogisticCode } = req;

    if (!ShipperCode || !LogisticCode) {
        ctx.body = {
            Err: "400, 参数错误"
        };
        return
    }
    //圆通 中通 申通 百世汇通 四家快递公司
    const company = ['YTO', 'STO', 'ZTO'];

    if (!company.includes(ShipperCode.toUpperCase())) {
        ctx.body = {
            Err: "目前只支持三家公司 圆通YTO 申通STO 中通ZTO"
        };
        return
    }

    // console.log('ShipperCode:' + ShipperCode);
    // console.log('LogisticCode:' + LogisticCode);

    //首先根据物流单号和公司编号 查询数据库，是否存在相应内容
    try {
        //如果存在，则直接返回该单号的物流信息
        let res = await Model.findOne({ ShipperCode, LogisticCode }, { Traces: 1, State: 1 });
        // console.log(res);
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
            log4js.error(err);
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

        //保存查询结果 TODU: 增加错误时 记录日志
        await Model.create(data).catch(e=>{
            log4js.error(e)
        })

    }
}

/**
 * 订阅
 * @param ctx
 * @returns {Promise<void>}
 */
async function sub(ctx) {

    //请求必须参数验证
    let { ShipperCode, LogisticCode, State } = ctx.request.body;
    if (State === '3' || State === '4') {
        ctx.body = {
            Err: "该快递状态不支持订阅，已签收或者出错！",
            Success: false
        };
        return
    }
    //圆通 中通 申通 百世汇通 四家快递公司
    const company = ['YTO', 'STO', 'ZTO', 'HTKY'];

    if (!company.includes(ShipperCode.toUpperCase())) {
        ctx.body = {
            Err: "目前只支持四家公司订阅 圆通YTO 申通STO 中通ZTO 百世汇通HTKY"
        };
        return
    }
    //查询是否已经订阅,若数据库存在订阅信息 则直接返回成功
    try {
        let isSub = await Model.findOne({ ShipperCode: ShipperCode, LogisticCode: LogisticCode }, {})
        // console.log("查询数据库中是否存在订阅信息");
        // console.log(isSub);
        if (isSub) {
            ctx.body = {
                Success: true,
                Msg: "数据库中已经存在订阅信息,直接返回订阅成功的状态"
            };
            return
        }
    } catch (err) {
        console.log(err);
        //查询不到结果 说明未订阅
    }

    let req = await privacy.index(ShipperCode, LogisticCode);
    try {
        //开始订阅
        var res = await express.subscribe(req);

        // console.log(res);

        //存储订阅结果  更新 或者 新建
        if (res.Success) {
            // 返回订阅结果
            ctx.body = {
                Success: res.Success,
                Msg: "新订阅成功!"
            }
            //订阅成功 更新数据库 
            let update = await Model.updateOne({ ShipperCode, LogisticCode }, { Sub: res.Success });
            // console.log(update);

            // 如果没有查到相应条目 则新增
            if (update.nModified === 0) {
                console.log("订阅状态:" + res.Success);

                let saver = await Model.create({ ShipperCode: ShipperCode, LogisticCode: LogisticCode, Sub: res.Success })
                console.log(saver);
            }
        } else {
            ctx.body = {
                Success: res.Success,
                Msg: res.Reason
            }
        }
    } catch (err) {
        console.log(err);

        ctx.body = {
            Err: err,
            Success: false
        }
    }
}

/**
 * 在快递鸟配置的回调地址的方法,用于接收回调 物流信息更新数据库
 * 请求方式POST,"Content-Type": "application/json;charset=utf-8"
 */
async function callBack(ctx) {
    // console.log(ctx.method);   POST
    log4js.info("有回调数据进来");
    //根据快递鸟返回的物流信息物流单号,更新数据库
    //首先获取POST的数据
    let post_params = ctx.request.body.RequestData;
    // console.log(typeof post_params);  string

    // 获取物流单号轨迹的数组
    let data = JSON.parse(post_params).Data;

    let res = {
        EBusinessID: EBusinessID,
        UpdateTime: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        Success: true,
        Reason: ""
    };
    ctx.body = res;
    // console.log(data);  Array(N) [Object]

    await data.forEach(async element => {
        //根据物流单号 查询数据库 并修改相应的轨迹信息
        let { LogisticCode, ShipperCode, Traces } = element;
        let Reason = "数据更新";
        let update = await Model.updateOne({ LogiticCode: LogisticCode, ShipperCode: ShipperCode }, { Traces: Traces, Reason: Reason })
        // console.log(update);  object {n: 0, nModified: 0, ok: 1}
        if (update.nModified === 0) {
            //保存数据
            await Model.create(element).catch(e=>{
                log4js.error("回调信息保存失败")
            })

        }
    });
}
/**
 * 查询 并 订阅
 * @param {Object} ctx 
 */
async function findWithSub(ctx) {
    const req = ctx.request.body;
    let { ShipperCode, LogisticCode } = req;
    if (!ShipperCode || !LogisticCode) {
        ctx.body = {
            Err: "400, 参数错误"
        };
        return
    }
    //圆通 中通 申通 百世汇通 四家快递公司
    const company = ['YTO', 'STO', 'ZTO'];

    if (!company.includes(ShipperCode.toUpperCase())) {
        // console.log('只支持三家公司 圆通YTO 申通STO 中通ZTO');
        ctx.body = {
            Err: "目前只支持三家公司 圆通YTO 申通STO 中通ZTO"
        };
        return
    }

    //首先根据物流单号和公司编号 查询数据库，是否存在相应内容
    try {
        //如果存在，则直接返回该单号的物流信息
        let res = await Model.findOne({ ShipperCode, LogisticCode }, { Traces: 1, State: 1, Sub: 1 });

        //返回轨迹信息之后 再检查 是否已经订阅,若否 则订阅
        // console.log(res);
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
                let State = res.State;

                //订阅 并更新数据库
                let req = await privacy.index(ShipperCode, LogisticCode);
                //开始订阅
                if (State != '3' && State != '4') {
                    var result = await express.subscribe(req);
                } else {
                    result.Success = false;
                    log4js.error("该快递状态不支持订阅，已签收或者出错！");
                }

                //查询成功 返回相应的值
                ctx.body = {
                    Success: true,
                    State: res.State,
                    List: res.Traces,
                    Sub: result.Success
                };

                //更新数据库
                let updateResult = await Model.updateOne({ ShipperCode, LogisticCode }, { Sub: result.Success })

                // console.log(updateResult);
                if (updateResult.nModified === 0) {
                    log4js.error("更新数据库失败")
                }

            }
        } else {
            //查询 保存 并订阅
            console.log("不存在记录");
            let data = await express.getOrderByJson({
                ShipperCode,
                LogisticCode
            }).catch((err) => {
                log4js.error(err);
                ctx.body = {
                    Err: err,
                    Success: false
                }
                return
            });
            let req = await privacy.index(ShipperCode, LogisticCode);
            let State = data.State;

            var result = false;

            //开始订阅
            if (State != '3' && State != '4') {
                result = await express.subscribe(req).Success;

            } else {
                log4js.error("该快递状态不支持订阅，已签收或者出错！");
            }
            //查询成功 返回相应的值        
            ctx.body = {
                Success: true,
                State: data.State,
                List: data.Traces,
                Sub: result
            };

            data.Sub = result;
            //保存查询结果 错误时记录日志
            await Model.create(data).catch((e) => {
                log4js.error("保存失败");
            })
        }
    } catch (e) {
        log4js.error(e);
    }

}
module.exports = {
    search,
    sub,
    callBack,
    findWithSub
};