'use strict';

module.exports = function (moduleRoutes, bookingService) {

    var bookingController = require('../controllers/booking.controller.js')(bookingService);
    
    moduleRoutes.get('/', bookingController.getBooking);
};