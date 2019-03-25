var winston = require('winstone'); // log manage module
var winstonDaily = require('winston-daily-rotate-file'); // log daily manage module
var moment = require('moment'); // time manage module

function timeStampFormat(){
    return moment().format('YYYY-MM-DD HH:mm:ss.SSS ZZ');
    // ex) '2016-05-01 20:14:28.500 +0900'
};

var logger = new (winston.Logger) ({
    transports:[
        new (winstonDaily)({
            name : 'info-file',
            filename : './log/server',
            datePattern : '_yyyy-MM-dd.log',
            colorize : false,
            maxsize : 50000000,
            maxFiles : 1000,
            level : 'info',
            showLevel : true,
            json : false,
            timestamp: timeStampFormat
        }),
        new (winston.transports.Console)({
            name : 'debug-console',
            colorize: true,
            level: 'debug',
            showLevel: true,
            json: false,
            timestamp: timeStampFormat
        })
    ],
    exceptionHandlers : [
        new (winstonDaily)({
            name : 'exception-file',
            filename : './log/exception',
            datePattern: '_yyyy-MM-dd.log',
            colorize: false,
            maxsize : 50000000,
            maxFiles : 1000,
            level: 'error',
            showLevel: true,
            json: false,
            timestamp: timeStampFormat
        }),
        new (winstone.transports.Console)({
            name : 'exception-console',
            colorize : true,
            level: 'debug',
            showLevel: true,
            json: false,
            timestamp: timeStampFormat
        })
    ]
});
