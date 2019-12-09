const config = require("/home/appkey/index.js");
const { AppKey, ReqURL, EBusinessID, imethod } = config;
const rp = require("request-promise");
const utility = require('utility')
const axios = require("axios");


/**
 * 即时查询
 * @param param waybill_no:快递单号
 * @param param exp_company_code:快递公司编码
 * @param param result_sort:排序规则,0降序,1升序
 * @returns res.code int 0:成功  string 201101:查询暂无记录 201102:请求参数错误 201103:不支持的快递品牌
 */
async function getTraces(waybill_no, exp_company_code, result_sort) {
    let jsondate = {
        waybill_no: waybill_no,
        exp_company_code: exp_company_code,
        result_sort: result_sort
    }
    let reqData = JSON.stringify(jsondate)
    let ts = Date.now();
    let sign = encrypt(ts);
    let req = {
        app_id: EBusinessID,
        method: imethod,
        ts: ts,
        data: reqData,
        sign: sign
    };

    var options = {
        method: "POST",
        url: ReqURL,
        headers: {
            "cache-control": "no-cache",
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        },
        form: req

    };

    let res = await rp(options);

    if (res) {
        return res
    } else {
        throw new Error("http request failed!")
    }
}

/**
 * 电商sign 签名生成 按照规则(md5(app_id + method + ts + api_key))生成的验证合法性签名
 * ts:当前请求的时间戳
 * app_id: EBusinessID 即用户id
 * @param ts 当前请求的时间戳
 * @return string
 */
function encrypt(ts) {
    return utility.md5(EBusinessID + imethod + ts + AppKey);
}

module.exports = {
    getTraces
};
