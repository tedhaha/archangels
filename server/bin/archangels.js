// global settings
global.config = require("../../config.json");
global.errorCode = require("../../errorCode.json");
var Logger = require(__dirname + "../../lib/Logger");
global.log = new Logger(__dirname + "/../logs/debug.log");
global.loge = new Logger(__dirname + "/../logs/exception.log");
global.printResult = require(__dirname + "../../lib/tedLibrary").printResult;

// composition root
var App = require("../lib/App");
var Database = require("../lib/Database");
var app = new App();
var dbPool = new Database(config.db);

// Use routes
app.use('/', new require("../routes/test")(app, dbPool));
app.use('/', new require("../routes/api")(app, dbPool));

// =============================================================================
// development environment
// =============================================================================
/*
 var env = process.env.NODE_ENV || 'development';
 if ('development' == env) {
 log.info(process.env.NODE_ENV);
 }
 */

// monitoring setting
app.get('/health', function (req, res) {
    res.send(new Buffer(JSON.stringify({
        pid: process.pid,
        memory: process.memoryUsage(),
        uptime: process.uptime()
    })));
    // TODO: check  https://github.com/lloyd/node-memwatch
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// service start
app.set('port', process.env.PORT || config.app.port);
var server = app.listen(app.get('port'), function () {
    log.info('Archangels server listening on port ' + server.address().port);
});