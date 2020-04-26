const axios = require('axios');
const hash = require('object-hash');
const Cryptr = require('cryptr');

const db = require('../models');
const geocodeApiKey = process.env.GEOCODE_API_KEY;
const geocodeURL = process.env.GEOCODE_API_URL;
const cryptr = new Cryptr(process.env.ENCRYPTION_KEY);

exports.getGeocodes = async function(req, res, next) {
	let { address_line_one: street, city, state, zip_code: postalcode } = req.query;

	const hashedAddress = hash({
		street     : street.trim().toLowerCase(),
		city       : city.trim().toLowerCase(),
		state      : state.trim().toLowerCase(),
		postalcode : postalcode.trim().toLowerCase()
	});
	try {
		const address = await db.Address.findOne({ hashedAddress }, '-_id -__v').lean();
		if (address) {
			console.log('from mongo');
			const { latitude, longitude } = JSON.parse(cryptr.decrypt(address.encryptedGeocode));
			return res.status(200).json({
				...req.query,
				latitude,
				longitude
			});
		}
	} catch (err) {
		console.log(err);
	}

	try {
		const response = await axios.get(geocodeURL, {
			params : { key: geocodeApiKey, street, city, state, postalcode, format: 'json' }
		});
		if (response.status === 200) {
			const [ result ] = response.data;
			const { lat: latitude, lon: longitude } = result;
			console.log('from api');
			res.status(200).json({
				...req.query,
				latitude,
				longitude
			});

			const encryptedGeocode = cryptr.encrypt(JSON.stringify({ latitude, longitude }));
			db.Address
				.create({ hashedAddress, encryptedGeocode })
				.then(() => console.log(`Address creation successful.`))
				.catch((err) => console.log(err));
		} else {
			const error = new Error(response.data.error);
			error.statusCode = response.status;
			next(error);
		}
	} catch (err) {
		err.statusCode = err.response.status;
		err.message = err.response.data.error;
		next(err);
	}
};
