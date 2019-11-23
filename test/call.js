const axios = require('axios')

async function test(param) {
    let res = await axios({
        url: 'http://www.lzhb.site:3000/callBack',
        // url: 'http://localhost:3000/callBack',
        data: param,
        method: 'post',
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        }
    }).catch((err) => {
        // throw err
        console.log(err.message);
    })
    if (res){

        console.log(res.data);
    }

}
test({
    "PushTime":"2019-11-21+15:13:25",
    "EBusinessID":"test1536407",
    "Data":[{
        "LogisticCode":"71758224138204",
        "ShipperCode":"SF",
        "Traces":[{
            "AcceptStation":"顺丰速运已收取快件",
            "AcceptTime":"2019-11-21+15:13:25",
            "Remark":""
        },
        {
            "AcceptStation":"货物已经到达深圳",
            "AcceptTime":"2019-11-21+15:13:252",
            "Remark":""
        },
        {
            "AcceptStation":"货物到达福田保税区网点",
            "AcceptTime":"2019-11-21+15:13:253",
            "Remark":""
        },
        {
            "AcceptStation":"货物已经被张三签收了",
            "AcceptTime":"2019-11-21+15:13:254",
            "Remark":""
        }],
        "State":"3",
        "EBusinessID":"test1536407",
        "Success":true,
        "Reason":"",
        "CallBack":"",
        "EstimatedDeliveryTime":"2019-11-21+15:13:25"
    }],
    "Count":"1"
}
)