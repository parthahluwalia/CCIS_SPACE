'use strict';

var Promise = require('bluebird');

module.exports = function () {

	// Booking Service Constructor
	function BookingService () {

	}

	// Get a booking -- placeholder dragons!
	BookingService.prototype.getBooking = function () {
		var booking = {
			_id: '1234567890123456',
			startTime: "11:00PM",
			endTime: "11:30 PM",
			purpose: "Fun",
			priority: "High",
			status: "Confirmed",
			createDate: "12 Feb 2016",
			room: {roomnumber: "1", capacity: "200", projector: "Availabe"},
			name: 'Kung Fu Panda',
			requestor: {name: {first: "Johnny", last: "depp"}, email: "johnnyDepp@abc.com", phone:"1234567890"}
		};

		return booking;
	};

	return new BookingService();
};