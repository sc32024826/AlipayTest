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

    it('实时查询接口,缺少必要参数', (done) => {
        let param = {
            waybill_no: "222"
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
            exp_company_code: "yt",
            waybill_no: "YT4260080802120"
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
            exp_company_code: "yt",
            waybill_no: "YT4260080802121"
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
})