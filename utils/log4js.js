/*
分装log4js模块
1 导出了不同类别的日志输出
2 导出koa框架中使用的响应日志 和 错误日志
*/
const path = require('path');
const logsPath = path.resolve(__dirname, '../logs');
const log4js = require('log4js');

log4js.configure({
  appenders: {
    out: {
      type: 'console',
    },
    info: {
      type: 'file', // 日志类型
      // category: 'errLogger',    //日志名称
      filename: `${logsPath}/info/info.log`, // 日志输出位置，当目录文件或文件夹不存在时自动创建
      // maxLogSize: '10MB', // 文件最大存储空间
      backups: 100, // 当文件内容超过文件存储空间时，备份文件的数量
    },
    error: {
      type: 'file',
      // category: 'errLogger',
      filename: `${logsPath}/error/error.log`,
      // maxLogSize: '10MB',
      backups: 100,
    },
  },
  categories: {
    out: { appenders: ['out'], level: 'info' },
    info: { appenders: ['info'], level: 'info' },
    error: { appenders: ['error'], level: 'error' },
    default: { appenders: ['error'], level: 'error' },
  },
});

// 日志返回的形式
function formatError(ctx, err, costTime) {
  const { method, url } = ctx;
  const { body } = ctx.request;
  const { header } = ctx.request;
  // const {userAgent} = ctx.header;
  return {
    method, url, body, costTime, err, header,
  };
}
// 日志返回的形式
function formatRes(ctx, costTime) {
  const {
    method, url, body, response,
  } = ctx;
  return {
    method, url, body, costTime, response,
  };
}

const outlog = log4js.getLogger('out');
const infolog = log4js.getLogger('info');
const errlog = log4js.getLogger('error');

const logger = {};

logger.out = (message) => {
  outlog.info(message);
};

logger.info = (message) => {
  infolog.info(message);
};

logger.error = (message) => {
  errlog.error(message);
};

// 封装响应日志
logger.koaReslog = (ctx, resTime) => {
  if (ctx) {
    infolog.info(formatRes(ctx, resTime));
  }
};

// 封装错误日志
logger.koaErrlog = (ctx, error, resTime) => {
  if (ctx && error) {
    errlog.error(formatError(ctx, error, resTime));
  }
};



module.exports = logger;
