const Model = require('../models/express');

/**
 * 查询数据库中的物流轨迹信息
 * @param ShipperCode {String}  查询条件
 * @param LogisticCode {String} 查询条件
 * @param mapping {Object} 过滤内容
 * @returns {Promise<void>}
 */
async function find(ShipperCode, LogisticCode, mapping) {
    //查找数据库中是否存在该物流单号
    let result = await Model.findOne({ ShipperCode: ShipperCode, LogisticCode: LogisticCode }, mapping);
    if (result) {
        // console.log(result);
        return result
    } else {
        throw ("查询不到相应结果")
    }
}

/**
 * 保存查询结果
 * @param {Object}data  快递鸟查询的结果
 * @returns {Promise<void>}
 */
async function save(data) {
    //存储查询结果
    await Model.create(data, (err, document) => {
        return !!document;
    });
}

/**
 * 更新轨迹信息
 * @param element
 * @returns {Promise<void>}
 */
async function update(element) {
    let { LogisticCode, ShipperCode, Traces } = element;
    let res = await Model.updateOne({ LogisticCode: LogisticCode, ShipperCode: ShipperCode },
        { Traces: Traces });
    if (res) {
        return res
    } else {
        throw "更新失败"
    }
}

module.exports = {
    find,
    save,
    update
};