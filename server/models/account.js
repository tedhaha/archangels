//app/models/account.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AccountSchema = new Schema({
    name: String
});

module.exports = mongoose.model('Account', AccountSchema);
