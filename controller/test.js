
const axios = require('axios')
const crypto = require('crypto');
const md5 = crypto.createHash('md5');

const querystring = require('querystring');
const apiUrl = 'http://sandboxapi.kdniao.com:8080/kdniaosandbox/gateway/exterfaceInvoke.json'
// const apiUrl = 'http://api.kdniao.com/Ebusiness/EbusinessOrderHandle.aspx'

const EBusinessID = 'test1536407';
const APIKey = "7041910f-beb5-4c60-b785-f2496a6dba6d"

async function queryTimely(params) {
  const { OrderCode, ShipperCode, LogisticCode } = params;
  const inputData = {
    OrderCode,
    ShipperCode,
    LogisticCode,
  };
  const RequestData = JSON.stringify(inputData);
  const DataSign = Buffer.from(md5.update(RequestData + APIKey).digest('hex')).toString('base64');

  console.log("签名" + DataSign);
  const data = querystring.stringify({
    RequestData,
    EBusinessID,
    RequestType: '1002',
    DataSign,
    // DataType: '2',
  });
  console.log("post数据" + data);

  // 发送请求
  const res = await axios({
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    },
    method: 'POST',
    url: apiUrl,
    data,
  }).catch(err => {
    console.log('err:', err);
    throw err;
  });

  // console.log('res.data:', res.data);
}

// 执行
queryTimely({
  OrderCode: '',
  ShipperCode: 'YTO',
  LogisticCode: '12345678',
});