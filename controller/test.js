const express = require('../models/express')


async function createAndFind(ctx) {
    await express.create({ ShipperCode: 'STO', LogisticCode: '110', Traces: [] }, (err, document) => {
        if (err) {
            console.error(err);
            ctx.body = "err"
        }
        console.log(document)
        ctx.body = "保存成功"
    })
}

async function finnd(ctx) {
    await express.find({}, (err, docs) => {
        if (err) {
            console.error(err);
        }
        if (docs) {
            ctx.body = docs
        }        
    })
}

module.exports = {
    createAndFind,
    finnd
}