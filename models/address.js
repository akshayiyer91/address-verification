const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
	hashedAddress    : {
		type     : String,
		unique   : true,
		required : true
	},
	encryptedGeocode : {
		type     : String,
		required : true
	}
});

module.exports = mongoose.model('Address', addressSchema);
