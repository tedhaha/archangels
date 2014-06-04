
// global settings
global.config = require("../../config.json");
global.errorCode = require("../../errorCode.json");
var Logger  = require(__dirname + "../../lib/Logger");
global.log  = new Logger(__dirname + "/../logs/debug.log");
global.loge = new Logger(__dirname + "/../logs/exception.log");

// composition root
var App = require("../lib/App");
var Database = require("../lib/Database");

var app = new App();
var dpbool = new Database(config.db);

// Use routes
app.use('/',new require("../routes/api")(app, dpbool));

// =============================================================================
// development environment
// =============================================================================
/*
 var env = process.env.NODE_ENV || 'development';
 if ('development' == env) {
     log.info(process.env.NODE_ENV);
 }
*/

//monitoring용
app.get('/health', function(req, res) {
    res.send(new Buffer(JSON.stringify({
        pid: process.pid,
        memory: process.memoryUsage(),
        uptime: process.uptime()
    })));
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

app.set('port', process.env.PORT || config.app.port);
var server = app.listen(app.get('port'), function () {
    log.info('Archangels server listening on port ' + server.address().port);
});