# AlipayTest
这个分支  使用的是 快递鸟API,
实际测试下来 API接口存在莫名其妙的错误.
1.回调地址传过来的快递轨迹数据  
跟其他网站上查的不一样,有时候跟他即时查询接口查的也不一样.
2.按理来说 反馈的数据 肯定是 在物流状态改变之后才更新过来的数据,也就是说 反馈过来的状态 不可能是 state:0
这个状态表示 还未发货  或者说是没有轨迹信息,但是实际测试的时候 会返回这样一个状态 并且 Success:false
