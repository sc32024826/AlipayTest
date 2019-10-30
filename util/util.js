const xmlreader = require('xmlreader')
const fs = require('fs')

const wxpay = {
    //金额转化为分
    getmoney: function (money) {
        return parseFloat(money) * 100
    },

    // 随机字符串产生函数
    createNonceStr: function () {
        return Math.random().toString(36).substr(2,15)
    },

    // 时间戳产生函数
    createTimeStamp: function () {
        return parseInt(new Date().getTime() / 1000) + ''
    },

    //签名加密算法
    paysignjsapi:function(appid,body,mch_id,nonce_str,notify_url,out_trade_no,spbill_create_ip,total_fee,trade_type,mchkey){
        let ret = {
            appid:appid,
            mch_id:mch_id,
            nonce_str:nonce_str,
            body:body,
            notify_url: notify_url,
            out_trade_no: out_trade_no,
            spbill_create_ip: spbill_create_ip,
            total_fee: total_fee,
            trade_type: trade_type
        }

        var string = raw(ret)
    }
}