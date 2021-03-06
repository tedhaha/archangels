
module.exports = function Database(db_config) {

    var generic_pool    = require('generic-pool');
    var mysql           = require('mysql');

    var pool = generic_pool.Pool({
        name: 'mysql',
        create: function(callback) {
            var config = {
                host : db_config.mysql_host,
                port : db_config.mysql_port,
                user : db_config.mysql_user,
                password : db_config.mysql_password,
                database : db_config.mysql_database
            }
            var client = mysql.createConnection(config);
            client.connect(function (error){
                if(error){
                    loge.error(error);
                }
                callback(error, client);
            });
        },
        destroy: function(client) {
            client.end();
        },
        min: db_config.mysql_pool_min,
        max: db_config.mysql_pool_max,
        idleTimeoutMillis : db_config.mysql_idleTimeoutMillis,
        log : db_config.mysql_log
    });

    process.on("exit", function() {
        pool.drain(function () {
            pool.destroyAllNow();
        });
    });

    return pool;
};
