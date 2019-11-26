const lib = require('../controller/express');
// const { describe } = require('mocha');
const assert = require('assert')
const request = require('supertest')
const app = require('../app.js')

describe("测试 express.js ", () => {

    var server;

    before(() => {
        server = app.listen(3000);
    })
    after(() => {
        server.close();
    })

    var json = {
        ShipperCode: "YTO",
        LogisticCode: "YT4231041583051"
    };

    describe('http 请求测试', () => {
        it('实时查询接口,参数出错', (done) => {
            let obj = {
                ShipperCode: "SF",
                LogisticCode: "YT4231041583051"
            };
            request(server)
                .post('/expressSearch')
                .send(obj)
                .expect(200, (err, res) => {
                    if (err) {
                        console.log(err);
                        done()
                    } else {
                        console.log(res.body);
                        done()
                    }
                })
        });
        it('实时查询接口,缺少必要参数', (done) => {
            let obj = {
                LogisticCode: "YT4231041583051"
            };
            request(server)
                .post('/expressSearch')
                .send(obj)
                .expect(200, (err, res) => {
                    if (err) {
                        console.log(err);
                        done()
                    } else {
                        console.log(res.body);
                        done()
                    }
                })
        });
        it('实时查询接口,数据库存在', (done) => {
            request(server)
                .post('/expressSearch')
                .send(json)
                .expect(200, (err, res) => {
                    if (err) {
                        console.log(err);
                        done()
                    } else {
                        // console.log(res.body);
                        done()
                    }
                })
        });
        it('实时查询接口,数据库不存在数据', (done) => {
            let obj = {
                ShipperCode: "YTO",
                LogisticCode: "YT4231041584051"
            };
            request(server)
                .post('/expressSearch')
                .send(obj)
                .expect(200, (err, res) => {
                    if (err) {
                        console.log(err);
                        done()
                    } else {
                        // console.log(res.body);
                        done()
                    }
                })
        });
        it('订阅接口测试,数据库中已经存在数据的情况下', (done) => {
            request(server)
                .post('/sub')
                .send(json)
                .expect(200, (err, res) => {
                    if (err) {
                        console.log(err);
                        done()
                    } else {
                        console.log(res.body);
                        done()
                    }
                })
        });
        it('订阅接口测试,数据库中不存在数据的情况下', (done) => {
            let obj = {
                ShipperCode: "YTO",
                LogisticCode: "YT4231041583052"
            };
            request(server)
                .post('/sub')
                .send(obj)
                .expect(200, (err, res) => {
                    if (err) {
                        console.log(err);
                        done()
                    } else {
                        console.log(res.body);
                        done()
                    }
                })
        });
        it('订阅接口测试,不支持的快递公司', (done) => {
            let obj = {
                ShipperCode: "JD",
                LogisticCode: "YT4231041583052"
            };
            request(server)
                .post('/sub')
                .send(obj)
                .expect(200, (err, res) => {
                    if (err) {
                        console.log(err);
                        done()
                    } else {
                        console.log(res.body);
                        done()
                    }
                })
        });
        it('查询并订阅接口测试:存在记录且已经订阅', (done) => {
            let obj = {
                ShipperCode: "YTO",
                LogisticCode: "YT4231041583051"
            };
            request(server)
                .post('/findWithSub')
                .send(obj)
                .expect(200, (err, res) => {
                    if (err) {
                        console.log(err);
                        done()
                    } else {
                        // console.log(res.body);
                        done()
                    }
                })
        });
        it('查询并订阅接口测试:存在记录 但是没订阅', (done) => {
            let obj = {
                ShipperCode: "YTO",
                LogisticCode: "YT4231041584051"
            };
            request(server)
                .post('/findWithSub')
                .send(obj)
                .expect(200, (err, res) => {
                    if (err) {
                        console.log(err);
                        done()
                    } else {
                        console.log(res.body);
                        done()
                    }
                })
        });
        it('查询并订阅接口测试:不存在记录', (done) => {
            let obj = {
                ShipperCode: "STO",
                LogisticCode: "YT4231041583052"
            };
            request(server)
                .post('/findWithSub')
                .send(obj)
                .expect(200, (err, res) => {
                    if (err) {
                        console.log(err);
                        done()
                    } else {
                        // console.log(res.body);
                        done()
                    }
                })
        });
    })

})