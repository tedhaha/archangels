
module.exports = function App() {

    var express = require('express');
    var path = require('path');
    var favicon = require('static-favicon');
    var logger = require('morgan');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');
    var methodOverride = require('method-override');
    var cors = require("cors");

    var app = express();

    var corsOptions = {         // Cross-origin_resource_sharing // from swagger
        credentials: true,
        origin: function(origin,callback) {
            if(origin===undefined) {
                callback(null,false);
            } else {
                var match = origin.match("^(.*)?."+config.app.allowedDomain+"(\:[0-9]+)?");
                var allowed = (match!==null && match.length > 0);
                callback(null,allowed);
            }
        }
    };

    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    app.use(favicon());
    app.use(logger('dev'));             // log every request to the console
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded());  // pull information from html in POST
    app.use(methodOverride());         // simulate DELETE and PUT
    app.use(cors(corsOptions));        // Cross-origin_resource_sharing
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    app.all('*', function(req, res, next) {         //
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    });


    return app;
};