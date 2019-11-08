const mongoose = require('mongoose')
const Schema = mongoose.Schema

//物流信息
const expressSchema = new Schema({
    // OrderCode:String,   //物流订单编号
    ShipperCode:String, //物流公司编号
    LogisticCode:String,    //物流运单号,即快递号
    Traces:Array
    //发货人信息
    // Sender:{
    //     Company:String, //公司
    //     Name:String,    //姓名
    //     Mobile:String,  //手机号
    //     ProvinceName:String,    //省
    //     CityName:String,        //市
    //     ExpAreaName:String,     //区,县
    //     Address:String          //详细地址,街道
    // },
    // //收件人信息
    // Receiver:{
    //     Company:String, //公司
    //     Name:String,    //姓名
    //     Mobile:String,  //手机号
    //     ProvinceName:String,    //省
    //     CityName:String,        //市
    //     ExpAreaName:String,     //区,县
    //     Address:String          //详细地址,街道
    // },
    // Commodity:String       //商品名称
})

const express = mongoose.model('express',expressSchema,'expresses') //第三个变量 为固定集合名 防止出现由mongodb 自动在集合名加S 导致的问题

module.exports = express