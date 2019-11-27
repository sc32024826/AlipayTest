const request = require('supertest')
const app = require('../app.js')

describe("测试", () => {

    var server;

    before(() => {
        server = app.listen(3000);
    })
    after(() => {
        server.close();
    })

    
    it('实时查询接口,公司编码错误', (done) => {
        let param = {
            ShipperCode: "SF",
            LogisticCode: "111"
        };
        request(server)
            .post('/expressSearch')
            .send(param)
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
        let param = {
            LogisticCode: "222"
        };
        request(server)
            .post('/expressSearch')
            .send(param)
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
        var param = {                               //测试时 数据库需存在此条数据
            ShipperCode: "YTO",
            LogisticCode: "YT4231041583051"
        };
        request(server)
            .post('/expressSearch')
            .send(param)
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
        let param = {                                     //测试时 数据库需不存在此条数据
            ShipperCode: "YTO",
            LogisticCode: "333"
        };
        request(server)
            .post('/expressSearch')
            .send(param)
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
        var param = {                               //测试时 数据库需存在此条数据
            ShipperCode: "YTO",
            LogisticCode: "YT4231041583051"
        };
        request(server)
            .post('/sub')
            .send(param)
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
    it('订阅接口测试,数据库中不存在数据的情况下:返回:新订阅成功', (done) => {
        let param = {
            ShipperCode: "YTO",
            LogisticCode: "120"
        };
        request(server)
            .post('/sub')
            .send(param)
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
    it('订阅接口测试,不支持的快递公司,返回:目前只支持四家公司订阅 圆通YTO 申通STO 中通ZTO 百世汇通HTKY', (done) => {
        let param = {
            ShipperCode: "JD",
            LogisticCode: "000"
        };
        request(server)
            .post('/sub')
            .send(param)
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
    it('订阅接口测试,物流状态出错,返回:该快递状态不支持订阅，已签收或者出错！', (done) => {
        let param = {                       
            ShipperCode: "JD",
            LogisticCode: "1234",
            State: '3'
        };
        request(server)
            .post('/sub')
            .send(param)
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
    it('查询并订阅接口测试:参数出错', (done) => {
        let param = {
            LogisticCode: "111"
        };
        request(server)
            .post('/findWithSub')
            .send(param)
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
    it('查询并订阅接口测试:支持的物流公司出错', (done) => {
        let param = {                       
            ShipperCode: "JD",
            LogisticCode: "1234",
        };
        request(server)
            .post('/findWithSub')
            .send(param)
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
            LogisticCode: "YT1"
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
    it('查询并订阅接口测试:不存在记录', (done) => {
        let obj = {
            ShipperCode: "YTO",
            LogisticCode: "YT000"
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
/*
    it('回调函数测试',(done)=>{
        let param = {
            "Data":[{
                "LogisticCode":"71758224138204",
                "ShipperCode":"SF",
                "Traces":[{
                    "AcceptStation":"顺丰速运已收取快件"
                },
                {
                    "AcceptStation":"货物已经到达深圳"
                },
                {
                    "AcceptStation":"货物到达福田保税区网点"
                },
                {
                    "AcceptStation":"货物已经被张三签收了"
                }]
            }]
        }

        request(server)
            .get('/callBack')
            .send(param)
            .expect(200, (err, res) => {
                if (err) {
                    console.log(err);
                    done()
                } else {
                    // console.log(res.body);
                    done()
                }
            })

    })
    */

})