module.exports = function Routes(app, dbpool) {

    var express = require('express');
    var router = express.Router();

    // retrieve player game status
    router.get('/api/users/pgs/:id', function (req, res) {
        var user_id = req.params.id;
        var gain_gold = req.params.gain_gold;

        dbpool.acquire(function (err, conn) {
            if (err) {
                return res.end("CONNECTION error: " + err);
            }
            conn.query('SELECT * from player_game_status where pgs_user_id= ? ', user_id, function (err, rows, columns) {
                console.log(rows[0].pgs_gold);
                console.log(rows);

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