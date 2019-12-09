<!DOCTYPE html>
<html lang="zh">

<head>
    <meta charset="utf-8" />
</head>

<body>
    <h1 id="h1-alipaytest">
        <a name="AlipayTest" class="reference-link"></a>
        <span class="header-link octicon octicon-link"></span>AlipayTest
    </h1>
    <p>试用快宝API开放接口,之前使用的快递鸟API 有点问题</p>
    <p>当前模块 仅有一个接口</p>
    <p>即时查询: <a href="http://www.lzhb.site:3000/expressSearch">http://www.lzhb.site:3000/expressSearch</a></p>
    <p>请求方式: POST</p>
    <p>请求头: Content-Type:application/json;Charset=utf-8</p>
    <h3 id="h3-u53C2u6570">
        <a name="参数" class="reference-link"></a><span class="header-link octicon octicon-link"></span>参数</h3>
    <table>
        <thead>
            <tr>
                <th>序号</th>
                <th>名称</th>
                <th>描述</th>
                <th>是否必须</th>
                <th>类型</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>1.</td>
                <td>exp_company_code</td>
                <td>快递公司编号</td>
                <td>是</td>
                <td>String</td>
            </tr>
            <tr>
                <td>2.</td>
                <td>waybill_no</td>
                <td>快递单号</td>
                <td>是</td>
                <td>String</td>
            </tr>
        </tbody>
    </table>
    <h3 id="h3--"><a name="返回参数:" class="reference-link"></a><span class="header-link octicon octicon-link"></span>返回参数:
    </h3>
    <table>
        <thead>
            <tr>
                <th>名称</th>
                <th>描述</th>
                <th>类型</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>List</td>
                <td>根据查询的单号数量返回对应的数组,但是由于快宝API并不支持所有快递的多重查找因此 这里仅返回长度为1个数组</td>
                <td>Array</td>
            </tr>
            <tr>
                <td>List.no</td>
                <td>单号</td>
                <td>String</td>
            </tr>
            <tr>
                <td>List.brand</td>
                <td>快递公司编号</td>
                <td>String</td>
            </tr>
            <tr>
                <td>List.status</td>
                <td>快递物流状态</td>
                <td>String</td>
            </tr>
            <tr>
                <td>List.data</td>
                <td>&gt;物流轨迹信息</td>
                <td>Array</td>
            </tr>
            <tr>
                <td>List.order</td>
                <td>物流轨迹信息排序规则</td>
                <td>String</td>
            </tr>
            <tr>
                <td>List.res</td>
                <td>文档未说明,暂且无视</td>
                <td>int</td>
            </tr>
            <tr>
                <td>Success</td>
                <td>查询是否成功的状态</td>
                <td>Boolean</td>
            </tr>
        </tbody>
    </table>
    <p>示例:<br>正常响应: </p>
    ```javascript
    {
        Success:true,
        List:[{
            no:'777005949070187',
            brand:'sto',
            status:'sending',
            data:[Array],
            order:'desc',
            res:0
         }]
    }
    <p>异常响应:</p>

</body>

</html>

```
