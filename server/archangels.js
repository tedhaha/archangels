// =============================================================================
// BASE SETUP
// =============================================================================

// call the packages we need
var express         = require('express'); 		// call express
var morgan          = require('morgan');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var config          = require("../config.json");
var app             = express(); 				// define our app using express

app.use(express.static(__dirname + '/public'));     // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                     // log every request to the console
app.use(bodyParser());                      // pull information from html in POST
app.use(methodOverride());                  // simulate DELETE and PUT

var port = process.env.PORT || config.service_port; 


// =============================================================================
// development environment
// =============================================================================
var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
    console.log('listening on port ' + port);
}

// =============================================================================
// connect to database
// =============================================================================

var _DBPool = require('./lib/_DBPool');

// =============================================================================
// router setting
// =============================================================================
var router = express.Router();

router.get('/', function (req, res) {
    res.json({ message: 'welcome to our Archangels' });   
});
router.get('/users', function(req,res){
    _DBPool.acquire(function(err, db) {
        if (err) {
            return res.end("CONNECTION error: " + err);
        }

        db.query("select * from user",[],function(err, rows, columns) {
        _DBPool.release(db);
 
        if (err) {
          return res.end("QUERY ERROR: " + err);
        }
        res.end(JSON.stringify(rows));
    });
  });
});




/*
http://bcho.tistory.com/m/post/892
TODO: 참고해서 login/:pid 시 없으면  insert 로 user와 player_game_status 생성하고 해당 데이터 리턴.  있으면 그대로 player_game_status 리턴)
transaction 처리해야함

TODO: rest 문서 업데이트
TODO: gold update.  exp update.  exp update시 table참고해서 level도 업.

TODO:  file update,  file download

router.get('/login/:pid', function (req, res) {
    var pid = req.params.pid;
    try{
       connection.query('SELECT * FROM user where user_pid ='+pid, function (error, rows, fields) {
            if(row.length == 0){
                connection.query('INSERT INTO user (user_pid) values ('+pid+')', function (error, rows, fields) {

                });

            }else{

            }
        });
        function finishRequest(){
            console.log("all: "+JSON.stringify(json_data));
            res.json(JSON.stringify(json_data));
        }
    } catch (exeception) {
        console.log(exeception);
        res.send(404);
    }
});
*/

app.use('/', router);
app.listen(port);

/*

var router = express.Router(); 				// get an instance of the express Router
// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:port/api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });	
	});

// on routes that end in /accounts
// ----------------------------------------------------
router.route('/accounts')

    // create a Account (accessed at POST http://localhost:ip/api/accounts)
    .post(function(req, res) {
        
        var account = new Account();        // create a new instance of the Account model
        account.name = req.body.name;  // set the accounts name (comes from the request)

        // save the Account and check for errors
        account.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Account created!' });
        });
    })
    // get all the accounts (accessed at GET http://localhost:8080/api/accounts)
    .get(function(req, res) {
        Account.find(function(err, accounts) {
            if (err)
                res.send(err);

            res.json(accounts);
        });
    });

// on routes that end in /accounts/:account_id
// ----------------------------------------------------
router.route('/accounts/:account_id')

    // get the account with that id (accessed at GET http://localhost:8080/api/accounts/:account_id)
    .get(function(req, res) {
        Account.findById(req.params.account_id, function(err, account) {
            if (err)
                res.send(err);
            res.json(account);
        });
    })

     // update the account with this id (accessed at PUT http://localhost:8080/api/accounts/:account_id)
    .put(function(req, res) {

        // use our account model to find the account we want
        Account.findById(req.params.account_id, function(err, account) {

            if (err)
                res.send(err);

            account.name = req.body.name;   // update the accounts info

            // save the account
            account.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Account updated!' });
            });

        });
    });


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

*/
