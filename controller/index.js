const express = require('./express');
const Model = require('../models/express');
const config = require("../config/index");
const { EBusinessID } = config;
const moment = require("moment");
const log4js = require('../utils/log4js');

/**
 * 首先 通过ctx 获取 请求参数,查询数据库是否存在物流的相应轨迹信息,若不存在,则订阅
 * @param {*} ctx 由于使用次数限制,应当包含收寄人详细信息
 */
async function search(ctx) {

    const req = ctx.request.body;
    let { exp_company_code, waybill_no } = req;
    exp_company_code = exp_company_code.toLowerCase();
    if (!exp_company_code || !waybill_no) {
        ctx.body = {
            Err: "400, 参数错误"
        };
        return
    }

    //首先根据物流单号和公司编号 查询数据库，是否存在相应内容
    try {
        //如果存在，则直接返回该单号的物流信息
        let res = await Model.findOne({ exp_company_code, waybill_no }, { data: 1, status: 1 });
        // console.log(res);
        ctx.body = {
            List: res.Traces,
            Success: true,
            Status: res.status
        }
    } catch (e) {
        console.log("数据不存在");
        let result_sort = '0';
        let res = await express.getTraces(waybill_no, exp_company_code, result_sort);
        // console.log(typeof res);        //类型为string
        res = JSON.parse(res);
        console.log(res);
        log4js.info(res.data);  // 类型为数组

        if (res.code == 0) {
            //查询成功 返回相应的值
            ctx.body = {
                Success: true,
                Status: res.status,
                List: res.data
            };
            let datas = res.data;
            datas.forEach(async element => {
                //保存查询结果
                let save = {
                    ShipperCode: element.brand,
                    LogisticCode: element.no,
                    Traces: element.data,
                    State: element.status,
                }
                log4js.info(save);
                await Model.create(save, (err, doc) => {
                    if (err) {
                        log4js.error("存储失败:" + err)
                    }
                })
            })
        }


    }
}

/**
 * 在快递鸟配置的回调地址的方法,用于接收回调 物流信息更新数据库
 * 请求方式POST,"Content-Type": "application/json;charset=utf-8"
 */
async function callBack(ctx) {
    // console.log(ctx.method);   POST
    //根据快递鸟返回的物流信息物流单号,更新数据库
    //首先获取POST的数据
    let post_params = ctx.request.body.RequestData;
    // console.log(typeof post_params);  string

    // 获取物流单号轨迹的数组
    let data = JSON.parse(post_params).Data;
    log4js.info(data);
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
        let { waybill_no, exp_company_code, Traces, Success } = element;
        // log4js.info(Traces);  //undefined

        //当state = 0 时,轨迹信息返回为null 此时 不更新
        if (Success == true) {
            let Reason = "数据更新";
            await Model.updateOne({ waybill_no, exp_company_code }, { Traces, Reason }, async (err, raw) => {
                if (err) {
                    log4js.error("更新失败:" + err)
                } else {
                    log4js.info("查找结果");
                    log4js.info(raw);
                    //没有匹配的数据  就保存数据
                    if (raw.n == 0) {
                        //保存数据
                        await Model.create(element, (err, doc) => {
                            if (err) {
                                log4js.error("回调信息保存失败! :" + err)
                            } else {
                                log4js.info("单号:" + waybill_no + ",存储成功!")
                            }

                        });
                        return
                    }
                    //修改成功
                    if (raw.nModified == 1) {
                        log4js.info("单号:" + waybill_no + ",更新成功!")
                    }
                    if (raw.nModified == 0) {
                        log4js.info("单号:" + waybill_no + ",更新失败,次数失败可以忽略,造成原因可能是数据相同")
                    }

                }
            })
        } else {
            log4js.info("单号:" + waybill_no + "返回数据有问题,跳过更新!")
        }

    });
}

module.exports = {
    search,
    callBack
};

