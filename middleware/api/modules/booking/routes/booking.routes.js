'use strict';

module.exports = function (moduleRoutes, bookingService) {

    var bookingController = require('../controllers/booking.controller.js')(bookingService);
    
    moduleRoutes.get('/', bookingController.getBookings);
    moduleRoutes.post('/', bookingController.createBooking);
    moduleRoutes.get('/available-space', bookingController.getAvailableSpaces);
};