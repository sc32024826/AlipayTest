const Model = require('../models/express');

/**
 *
 * @param ShipperCode
 * @param LogisticCode
 * @returns {Promise<void>}
 */
async function find(ShipperCode, LogisticCode) {
    //查找数据库中是否存在该物流单号
    await Model.findOne({ShipperCode: ShipperCode, LogisticCode: LogisticCode}, {Traces: 1},
        async (e, doc) => {
            return {
                err: e,
                doc: doc
            }
        })
}

/**
 * 
 * @param data
 * @returns {Promise<void>}
 */
async function save(data){
    //存储查询结果
    await Model.create(data, (err, document) => {
        return !!document;
    });
}
module.exports = {
    find
}