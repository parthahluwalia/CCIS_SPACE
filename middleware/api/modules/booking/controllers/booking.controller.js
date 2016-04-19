'use strict';

var Promise = require('bluebird');

module.exports = function (bookingService) {
    // Booking Controller Constructor
    function BookingController () {

    }

    /**
     * Get the bookings, based on the booking criteria specified in the request
     * Sends the bookings found with a status code 200, in case of success
     * Sends an errored response with a status code 400, otherwise
     * @param: req, res, next 
     */
    BookingController.prototype.getBookings = function(req, res, next) {
        var bookingDetails = req.query;

        return bookingService.getBookings(bookingDetails)
            .then(function (bookingList) {
                console.log('Bookings in controller: ' + bookingList, null, 2);
                res.status(200).send(bookingList);
            })
            .catch(function (err) {
                res.status(400).send(err);
            });
    };

    /**
     * Create a booking, spliting a booking request to n booking records
     * Sends the bookings created with a status code 200, in case of success
     * Sends an errored response with a status code 400, otherwise 
     * @param: req, res, next 
     */
    BookingController.prototype.createBooking = function (req, res, next) {
        var bookingDetails = req.body;

        return bookingService.createBooking(bookingDetails)
            .then(function (bookings) {
                console.log('Bookings in booking controller: ');
                console.log(bookings, null, 2);
                res.status(200).send(bookings);
            })
            .catch(function (err) {
                res.status(400).send(err);
            });        
    };

    /**
     * Get the available spaces, based on the booking criteria specified in the request
     * Sends the available spaces found with a status code 200, in case of success
     * Sends an errored response with a status code 400, otherwise
     * @param: req, res, next 
     */
    BookingController.prototype.getAvailableSpaces = function(req, res, next) {
        var bookingCriteria = req.query;

        return bookingService.getAvailableSpaces(bookingCriteria)
            .then(function (availableSpaces) {
                console.log('Available Spaces in controller: ', availableSpaces, null, 2);
                res.status(200).send(availableSpaces);
            })
            .catch(function (err) {
                res.status(400).send(err);
            });
    };

    return new BookingController();
};