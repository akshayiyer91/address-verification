const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

module.exports.Address = require('./address');
