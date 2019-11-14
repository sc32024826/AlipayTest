const mongoose = require('mongoose')
const Schema = mongoose.Schema

//物流信息
const expressSchema = new Schema({
    ShipperCode: String, //物流公司编号
    LogisticCode: String,    //物流运单号,即快递号
    Traces: Array,
    OrderCode: String,
    Success: Boolean,
    State: Number,
    EBusinessID: String,
    Reason: String

}, { versionKey: false })

const express = mongoose.model('express', expressSchema, 'express') //第三个变量 为固定集合名 防止出现由mongodb 自动在集合名加S 导致的问题

module.exports = express