const express = require('express');
const mongoose = require('mongoose');
const compression = require('compression');
const helmet = require('helmet');
const app = express();

app.use(compression());
app.use(helmet());

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET');
	next();
});

app.use('/address', require('./routes/address'));

app.use('*', (req, res) => {
	res.status(404).json({ message: 'Resource does not exist' });
});

app.use((error, req, res, next) => {
	const status = error.statusCode || 500;
	const message = error.message || 'Unknown error - Please try again after some time';
	res.status(status).json({ message });
});

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

app.listen(process.env.PORT, process.env.IP, function() {
	console.log('Server Started');
	mongoose.connect(process.env.MONGODB_URI).catch((err) => console.log(err));
});
