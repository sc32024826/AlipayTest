const path = require('path');
const log4js = require('log4js')

// 自定义日志类别
log4js.configure({
    appenders: {
        console: {
            type: 'console',
            category: "console"
        }, 
        file: {
            type: 'file',
            category: 'fileLog',
            filename: path.join(__dirname, '../log/log.log'),
            maxLogSize: 104857600,
            backups: 100
        }
    },
    replaceConsole: true,
    levels: {
        console: 'ALL',
        fileLog: 'ALL',
    }
});
const logger = log4js.getLogger('file');
const getLogger = (type) => {
    return log4js.getLogger(type);
}
// 设置日志级别
logger.setLevel(logLevel.toUpperCase());

exports.logger = logger;
exports.getLogger = getLogger;
exports.use = (app) => {
    app.use(log4js.connectLogger(logger, { level: 'info', format: ':method :url :status :response-timems' }));
}
