'use strict';

module.exports = function (moduleRoutes, bookingService, memberService) {

    var bookingController = require('../controllers/booking.controller.js')(bookingService),
    	memberController = require('../../member/controllers/member.controller.js')(memberService);
    
    moduleRoutes.get('/', memberController.isAuthenticated, bookingController.getBookings);
    moduleRoutes.post('/', memberController.isAuthenticated, bookingController.createBooking);
    moduleRoutes.get('/available-space', memberController.isAuthenticated, bookingController.getAvailableSpaces);
    moduleRoutes.delete('/', memberController.isAuthenticated, bookingController.cancelBookingById);
};