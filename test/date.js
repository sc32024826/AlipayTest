const moment = require('moment')

function test() {
    let a = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
    console.log(a)
}
test()