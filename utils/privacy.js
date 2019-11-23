/**
 * 传入ShipperCode,LogisticCode两个参数,返回带有收寄人信息的object
 * @param {String} ShipperCode 
 * @param {String} LogisticCode 
 * @returns {Object}
 */
async function index(ShipperCode, LogisticCode) {

    //不想给快递鸟 收集个人信息，直接以虚假信息覆盖
    let privateInfo = {
        PayType: 1,
        Sender: {
            Name: "11",
            Tel: "",
            Mobile: "12345678911",
            ProvinceName: "广东省",
            CityName: "广州市",
            ExpAreaName: "白云区",
            Address: "紫金港"
        },
        Receiver: {
            Name: "12",
            Tel: "",
            Mobile: "88888888888",
            ProvinceName: "江苏省",
            CityName: "苏州市",
            ExpAreaName: "扬州区",
            Address: "御龙湾"
        }
    };
    // 覆盖收寄人信息
    let req = Object.assign({ ShipperCode, LogisticCode }, privateInfo);
    return req
}


module.exports = {
    index
}