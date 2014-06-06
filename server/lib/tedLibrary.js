// usage: show query result
//
// global.printResult = require(__dirname + "../../lib/tedLibrary").printResult;
// printResult(arguments);
var util = require("util");

module.exports.printResult = function (arguments) {
    log.debug(arguments.length);
    for (var i = 0; i < arguments.length; i++) {
        log.debug("type: " + typeof arguments[i]);
        if (typeof arguments[i] == "object") {
            log.debug("arguemnts[" + i + "]: \n" + util.inspect(arguments[i], { showHidden: true, depth: null }));
        } else {
            log.debug("arguemnts[" + i + "]: \n" + arguments[i]);
        }
    }
};

// fail
module.exports.dbManager = function (dbPool, functionArray) {
    var async = require("async");

    dbPool.acquire(function (err, conn) {
        if (err) {
            loge.warning("CONNECTION ERROR: \n" + err);
            return res.end("CONNECTION error: \n" + err);
        }
        async.waterfall(
            functionArray,
            function (err, result) {
                dbPool.release(conn);
                if (err == null) {
                    log.debug('Program closed.');
                } else {
                    loge.warning("QUERY ERROR: \n" + err);
                    return res.end("QUERY ERROR: \n" + err);
                }
            });
    });
};
