#!/usr/bin/env node
var debug = require('debug')('Archangels');
var app = require('../archangels');
var config = require("../../config.json");

app.set('port', process.env.PORT || config.service_port);

var server = app.listen(app.get('port'), function() {
  debug('Archangels server listening on port ' + server.address().port);
});

