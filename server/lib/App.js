
module.exports = function App() {

    var express = require('express');
    var path = require('path');
    var favicon = require('static-favicon');
    var logger = require('morgan');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');
    var methodOverride = require('method-override');

    var app = express();

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

    return app;
};