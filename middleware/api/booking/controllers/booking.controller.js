'use strict';

module.exports = function (bookingService) {
    // Booking Controller Constructor
    function BookingController () {

    }

    BookingController.prototype.getBooking = function(req, res, next) {
          //console.log('In Booking controller');
        var booking = bookingService.getBooking();

        res.status(200).send(booking);
    };

    return new BookingController();
};