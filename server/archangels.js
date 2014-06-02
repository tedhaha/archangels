
var express         = require('express'); 
var path = require('path');
var favicon = require('static-favicon');	
var logger          = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var config          = require("../config.json");

var routes = require('./routes/index');
var users = require('./routes/users');

var app             = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));             // log every request to the console
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());  // pull information from html in POST
app.use(methodOverride());         // simulate DELETE and PUT
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// =============================================================================
// connect to database
// =============================================================================

var pool = require('./lib/_DBPool');

// =============================================================================
// development environment
// =============================================================================
/*
var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
    console.log('listening on port ' + port);
}
*/

// =============================================================================
// router setting
// =============================================================================
app.use('/', routes);
app.use('/users', users);

var router = express.Router();

// dbtest retrieve users
router.get('/dbtest/users', function(req,res){
    pool.acquire(function(err, conn) {
        if (err) {
            return res.end("CONNECTION error: " + err);
        }
        conn.query("select * from user",[],function(err, rows, columns) {
        pool.release(conn);
        if (err) {
          return res.end("QUERY ERROR: " + err);
        }
        res.end(JSON.stringify(rows));
    });
  });
});

// retrieve player game status
router.get('/api/users/pgs/:id', function(req,res){
    var user_id =  req.params.id;
    var gain_gold = req.params.gain_gold;
console.log(gain_gold);
    pool.acquire(function(err, conn) {
        if (err) {
            return res.end("CONNECTION error: " + err);
        }
        conn.query('SELECT * from player_game_status where pgs_user_id= ? ',user_id,function (err, rows, columns) {
        console.log(rows[0].pgs_gold);
console.log(rows);

        pool.release(conn);
        if (err) {
          return res.end("QUERY ERROR: " + err);
        }
        res.end(JSON.stringify(rows));
    });
  });
});

// retrieve player game status
router.put('/api/users/pgs/:id', function(req,res){
    var user_id =  req.params.id;
    var gold_gain =  req.params.id;
    pool.acquire(function(err, conn) {
        if (err) {
            return res.end("CONNECTION error: " + err);
        }
        conn.query('SELECT * from player_game_status where pgs_user_id= ? ',user_id,function (err, rows, columns) {
        pool.release(conn);
        if (err) {
          return res.end("QUERY ERROR: " + err);
        }
        res.end(JSON.stringify(rows));
    });
  });
});

// retrieve player game status
router.get('/api/users/pgs', function(req,res){
    pool.acquire(function(err, conn) {
        if (err) {
            return res.end("CONNECTION error: " + err);
        }
        conn.query("select * from player_game_status",[],function(err, rows, columns) {
        pool.release(conn);
        if (err) {
          return res.end("QUERY ERROR: " + err);
        }
        res.end(JSON.stringify(rows));
    });
  });
});

// retrieve users
router.get('/api/users', function(req,res){
    pool.acquire(function(err, conn) {
        if (err) {
            return res.end("CONNECTION error: " + err);
        }
        conn.query("select * from user",[],function(err, rows, columns) {
        pool.release(conn);
        if (err) {
          return res.end("QUERY ERROR: " + err);
        }
        res.end(JSON.stringify(rows));
    });
  });
});



// retrieve user
router.get('/api/users/:id', function(req,res){
    var user_id =  req.params.id;
    pool.acquire(function(err, conn) {
        if (err) {
            return res.end("CONNECTION error: " + err);
        }
        conn.query('SELECT * from user where user_id= ? ',user_id,function (err, rows, columns) {
        pool.release(conn);
        if (err) {
          return res.end("QUERY ERROR: " + err);
        }
        res.end(JSON.stringify(rows));
    });
  });
});

// create user
router.post('/api/users', function(req,res){
    //TODO: email 중복체크
    var user = {
                  'user_pid':req.body.user_pid
                  ,'user_email':req.body.user_email
                  ,'user_password':req.body.user_password
                  ,'user_nickname':req.body.user_nickname
            };
 
    pool.acquire(function(err, conn) {
        if (err) {
            return res.end("CONNECTION error: " + err);
        }
        conn.beginTransaction(function(err) {
            if (err) {
                throw err;
            }
            //conn.query('INSERT INTO user VALUES ?', user, function (err, result) {
            conn.query('INSERT INTO user (user_pid,user_email,user_password,user_nickname) VALUES (?,?,?,?)',
                    [req.body.user_pid,req.body.user_email,req.body.user_password,req.body.user_nickname], function (err, result) {
                if (err) {
                    console.error(err);
                    conn.rollback(function () {
                        console.error('rollback error');
                        throw err;
                    });
                }// if err
                console.log('insert transaction log');
                user_id = result.insertId;
                console.log('result: ',result);

                conn.query('INSERT INTO player_game_status (pgs_user_id) values (?)',user_id, function (err, result) {
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

app.use('/', router);

// =============================================================================
// error handler 
// =============================================================================

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

