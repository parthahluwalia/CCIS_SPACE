'use strict';

var Promise = require('bluebird');

module.exports = function (bookingService) {
    // Booking Controller Constructor
    function BookingController () {

    }

    // function

    BookingController.prototype.getBooking = function(req, res, next) {
        // console.log('In Booking controller');
        var bookingCriteria = req.query;

        var bookings = bookingService.getBooking(bookingCriteria);

        res.status(200).send(bookings);
    };

    BookingController.prototype.createBooking = function (req, res, next) {
        var bookingDetails = req.body;

        var booking = bookingService.createBooking(bookingDetails)
            .then(function (bookings) {
                console.log('Bookings in booking controller');
                console.log(bookings, null, 2);
                return bookings;
            })
            .catch(function (error) {
                // Should trigger error here...
                return error;
            });

        res.status(200).send(booking);
    };

    return new BookingController();
};