# AlipayTest
试用快宝API开放接口,之前使用的快递鸟API 有点问题

当前模块 仅有一个接口

即时查询: http://www.lzhb.site:3000/expressSearch'

请求方式: POST

请求头: Content-Type:application/json;Charset=utf-8

###参数 
|序号  |名称                    |描述           |是否必须       |类型
|-----|----|----|---|
|1.    |exp_company_code       |快递公司编号     |是          |String
|2.    |waybill_no             |快递单号        |是          |String

###返回参数:
|名称|描述|类型
|---|--|---|
|List  |根据查询的单号数量返回对应的数组,但是由于快宝API并不支持所有快递的多重查找因此 这里仅返回长度为1个数组|Array|
|List.no|单号|String|
|List.brand|快递公司编号|String|
|List.status|快递物流状态|String|
|List.data|>物流轨迹信息|Array|
|List.order|物流轨迹信息排序规则|String|
|List.res|文档未说明,暂且无视|int|
|Success|查询是否成功的状态|Boolean|
示例:
正常响应:
```javascript
            {
            Success: true,
            List: [{
                no: '777005949070187',
                brand: 'sto',
                status: 'sending',
                data: [Array],
                order: 'desc',
                res: 0
                }]
            }
```
异常响应:
```javascript
            {
            "code": "错误代码",
            "msg": "错误信息",
            "data": {}
            }
```

