var winston = require('winston');
winston.addColors(config.logging.colors);

module.exports = function (filename) {
    var logger = new winston.Logger({
        transports: [
            new winston.transports.Console({
                level: config.logging.consoleSetting,
                colorize:true
            }),
            new winston.transports.File({
                level: config.logging.fileSetting,
                colorize:true,
                json: false,
                filename: filename
            })
            /*
            ,new winston.transports.MongoDB({
                host: 'localhost',
                db: 'logDb',
                collection: 'log',
                level: 'info',
                levels: customLevels.levels,
                handleExceptions: true
            })
            */
        ]
    });
    //logger.setLevels(winston.config.syslog.levels);
    logger.setLevels(config.logging.levels);
    logger.exitOnError = false;
    return logger;
};

