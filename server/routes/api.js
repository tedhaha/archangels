module.exports = function Routes(app, dbpool) {

    var express = require('express');
    var router = express.Router();
    var async = require("async");
    var util = require("util");

    // retrieve player game status
    router.get('/api/users/pgs2/:id', function (req, res) {
        var user_id = req.params.id;

        dbpool.acquire(function (err, conn) {
            if (err) {
                loge.warning("CONNECTION ERROR: \n" + err);
                return res.end("CONNECTION error: \n" + err);
            }
            async.waterfall([
                    function (cb) {
                        conn.query('SELECT * from player_game_status where pgs_user_id= ? ', user_id, cb);
                    },
                    function (rows, columns, cb) {
                        printResult(arguments);
                        res.end(JSON.stringify(rows));
                        cb();
                    }
                ],
                function (err, result) {
                    dbpool.release(conn);
                    if (err == null) {
                        log.debug('Program closed.');
                    } else {
                        loge.warning("QUERY ERROR: \n" + err);
                        return res.end("QUERY ERROR: \n" + err);
                    }
                });
        });
//
//        async.waterfall([
//                function (cb) {
//                    dbpool.acquire(cb);
//                },
//                function (conn, cb) {
//                    log.debug(arguments.length, 2);
//                    for (var i = 0; i < arguments.length; i++) {
//                        if (typeof arguments[i] == "object") {
//                            log.debug("arguemnts[" + i + "]: " + util.inspect(arguments[i], { showHidden: true, depth: null }));
//                        } else {
//                            log.debug("arguemnts[" + i + "]: " + arguments[i]);
//                        }
//                    }
//                    conn.query('SELECT * from player_game_status where pgs_user_id= ? ', user_id, function (err, rows, columns) {
//                        if(err){
//                            dbpool.release(conn);
//                            cb(err);
//                        }else{
//                            cb(null,rows,columns,conn);
//                        }
//                    });
//                },
//                function (rows, columns, conn, cb) {
//                    log.debug(arguments.length, 2);
//                    for (var i = 0; i < arguments.length; i++) {
//                        log.debug(typeof arguments[i]);
//                        if (typeof arguments[i] == "object") {
//                            log.debug("arguemnts[" + i + "]: " + util.inspect(arguments[i], { showHidden: true, depth: null }));
//                        } else {
//                            log.debug("arguemnts[" + i + "]: " + arguments[i]);
//                        }
//                    }
//                    //log.info("columns:" +columns);
//                    res.end( util.inspect(rows, { showHidden: true, depth: null }));
//                    //res.end(JSON.stringify(rows));
//                }
//            ],
//            function (err) {
//                loge.error(err);
//                return res.end("ERROR: " + err);
//            }
//        )
    });


// retrieve player game status
    router.get('/api/users/pgs/:id', function (req, res) {
        var user_id = req.params.id;
        var gain_gold = req.params.gain_gold;

        dbpool.acquire(function (err, conn) {
            if (err) {
                return res.end("CONNECTION error: " + err);
            }
            conn.query('SELECT * from player_game_status where pgs_user_id= ? ', user_id, function (err, rows, columns) {
                log.info(rows);
                log.info(columns);

                dbpool.release(conn);
                if (err) {
                    return res.end("QUERY ERROR: " + err);
                }
                res.end(JSON.stringify(rows));
            });
        });
    });


// retrieve player game status
    router.put('/api/users/pgs/:id', function (req, res) {
        var user_id = req.params.id;
        var gold_gain = req.params.id;
        dbpool.acquire(function (err, conn) {
            if (err) {
                return res.end("CONNECTION error: " + err);
            }
            conn.query('SELECT * from player_game_status where pgs_user_id= ? ', user_id, function (err, rows, columns) {
                dbpool.release(conn);
                if (err) {
                    return res.end("QUERY ERROR: " + err);
                }
                res.end(JSON.stringify(rows));
            });
        });
    });

// retrieve player game status
    router.get('/api/users/pgs', function (req, res) {
        dbpool.acquire(function (err, conn) {
            if (err) {
                return res.end("CONNECTION error: " + err);
            }
            conn.query("select * from player_game_status", [], function (err, rows, columns) {
                dbpool.release(conn);
                if (err) {
                    return res.end("QUERY ERROR: " + err);
                }
                res.end(JSON.stringify(rows));
            });
        });
    });

// retrieve users
    router.get('/api/users', function (req, res) {
        dbpool.acquire(function (err, conn) {
            if (err) {
                return res.end("CONNECTION error: " + err);
            }
            conn.query("select * from user", [], function (err, rows, columns) {
                dbpool.release(conn);
                if (err) {
                    return res.end("QUERY ERROR: " + err);
                }
                res.end(JSON.stringify(rows));
            });
        });
    });


// retrieve user
    router.get('/api/users/:id', function (req, res) {
        var user_id = req.params.id;
        dbpool.acquire(function (err, conn) {
            if (err) {
                return res.end("CONNECTION error: " + err);
            }
            conn.query('SELECT * from user where user_id= ? ', user_id, function (err, rows, columns) {
                dbpool.release(conn);
                if (err) {
                    return res.end("QUERY ERROR: " + err);
                }
                res.end(JSON.stringify(rows));
            });
        });
    });

// create user
    router.post('/api/users', function (req, res) {
        //TODO: email 중복체크
        var user = {
            'user_pid': req.body.user_pid, 'user_email': req.body.user_email, 'user_password': req.body.user_password, 'user_nickname': req.body.user_nickname
        };

        dbpool.acquire(function (err, conn) {
            if (err) {
                return res.end("CONNECTION error: " + err);
            }
            conn.beginTransaction(function (err) {
                if (err) {
                    throw err;
                }
                //conn.query('INSERT INTO user VALUES ?', user, function (err, result) {
                conn.query('INSERT INTO user (user_pid,user_email,user_password,user_nickname) VALUES (?,?,?,?)',
                    [req.body.user_pid, req.body.user_email, req.body.user_password, req.body.user_nickname], function (err, result) {
                        if (err) {
                            console.error(err);
                            conn.rollback(function () {
                                console.error('rollback error');
                                throw err;
                            });
                        }// if err
                        console.log('insert transaction log');
                        user_id = result.insertId;
                        console.log('result: ', result);

                        conn.query('INSERT INTO player_game_status (pgs_user_id) values (?)', user_id, function (err, result) {
                            if (err) {
                                console.error(err);
                                conn.rollback(function () {
                                    console.error('rollback error');
                                    throw err;
                                });
                            }// if err
                            conn.commit(function (err) {
                                if (err) {
                                    console.error(err);
                                    conn.rollback(function () {
                                        console.error('rollback error');
                                        throw err;
                                    });
                                }// if err
                                res.send(200, 'success');

                            });// commit
                        });// insert into log
                    });// inset into users
            }); // begin trnsaction
        });
    });

    return router;
}