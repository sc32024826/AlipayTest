const express = require('./express');
const Model = require('../models/express');
const log4js = require('../utils/log4js');

/**
 * 首先 通过ctx 获取 请求参数,查询数据库是否存在物流的相应轨迹信息,若不存在,则订阅
 * @param {*} ctx 由于使用次数限制,应当包含收寄人详细信息
 */
async function search(ctx) {

    const req = ctx.request.body;
    let { exp_company_code, waybill_no } = req;
    if (!exp_company_code || !waybill_no) {
        ctx.body = {
            Err: "400, 参数错误"
        };
        return
    }
    exp_company_code = exp_company_code.toLowerCase();

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
        } else {
            ctx.body = {
                Code: res.code,
                Msg: res.msg
            }
        }
    }
}
module.exports = {
    search
};

