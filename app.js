//数据库
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
mongoose.connect('mongodb://localhost:27017/local', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const bodyparser = require('koa-bodyparser')
const index = require('./routes/index')
// const cors = require('cors')
const onerror = require('koa-onerror')
const logger = require('koa-logger')
onerror(app)
// middlewares
app.use(logger())
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
// routes
app.use(index.routes(), index.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});
module.exports = app
