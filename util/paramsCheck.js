/**
 * 检查Param参数是否符合
 * @param {*} Param 
 * @returns 返回0表示不符合,返回1 表示
 */
async function check(Param) {
    if (JSON.parse(Param) == Object) {        //检查 是否是json对象
        if (!Param.logistic || !Param.ShipperCode) {      //检查是否携带必要参数
            return 0;                          //返回 0 表示结果不符合
        } else if (!Param.Sender || !Param.Receiver) {
            return 1;                           //返回1 表示符合 不携带收寄人信息的查询
        } else {
            return 2;                           //表示符合 携带收寄人信息的查询
        }
    }
}

module.exports = {
    check
}