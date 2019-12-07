# AlipayTest
试用快宝API开放接口,之前使用的快递鸟API 有点问题

当前模块 仅有一个接口

即时查询: http://www.lzhb.site:3000/expressSearch'

请求方式: POST

请求头: Content-Type:application/json;Charset=utf-8

参数:   
    名称                     描述           是否必须        类型
1.  exp_company_code     快递公司编号           是          String
2.  waybill_no           快递单号               是          String

返回参数:  <table>
    <thead>
        <tr>
            <th>名称</th>                   
            <th>描述</th>                                            
            <th>类型</th>
        </tr>
    </thead>
    <tr>
        <td>List  </td>
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
    <td>物流轨迹信息</td> 
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
  </table>
示例:  
正常响应:
<code>
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
</code>  
异常响应:  
<code>
            {  
            "code": "错误代码",  
            "msg": "错误信息",  
            "data": {}  
            }  
</code>

