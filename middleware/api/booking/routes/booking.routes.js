'use strict';

module.exports = function (moduleRoutes) {
	console.log('Loading booking...');
	moduleRoutes.get('/', function (req, res) {
		console.log('Hello success');
		res.status(200).send('You successfully reached booking routes!!!');
	});
};