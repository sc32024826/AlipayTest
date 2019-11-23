const axios = require('axios')

async function test(param) {
    let res = await axios({
        // url: 'http://106.54.20.38:3000/expressSearch',
        // url: 'http://localhost:3000/expressSearch',
        // url: 'http://localhost:3000/sub',
        // url: 'http://106.54.20.38:3000/sub',
        
        url: 'http://localhost:3000/findWithSub',
        data: param,
        method: 'POST',
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        }
    }).catch((err) => {
        console.log("ERROR MESSAGE:" + err.message);
    })
    if (res){
        console.log(res.data);
    }
    
}

test(
    {
        ShipperCode: "YTO",
        LogisticCode: "YT4231041583057"
    }
)