const express = require('express');
const middleware = require('../middleware/index');
const controller = require('../controllers/address');
const router = express.Router({ mergeParams: true });

router.get('/verify', middleware.validateInput, controller.getGeocodes);

module.exports = router;
