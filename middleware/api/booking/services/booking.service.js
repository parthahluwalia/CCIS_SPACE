'use strict';

var Promise = require('bluebird');

module.exports = function () {

	// Booking Service Constructor
	function BookingService () {

	}

	// Get a booking -- placeholder dragons!
	BookingService.prototype.getBooking = function () {
		var booking = {
			name: 'Kung Fu Panda',
			email: 'dragon.warrior@pandas.com',
			purpose: 'Sleeping',
			resources: 'Just a bed'
		};

		return booking;
	};

	return new BookingService();
};