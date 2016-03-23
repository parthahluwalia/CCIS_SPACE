'use strict';

var Promise = require('bluebird'),
    _ = require('lodash'),
    moment = require('moment');

module.exports = function (ccisroomDb) {

    // Booking Service Constructor
    function BookingService () {
        this.BookingModel = require('../../../database/models/booking.model.js')(ccisroomDb);
        this.RequestorModel = require('../../../database/models/requestor.model.js')(ccisroomDb);
    }

    function getBookingCriteria (startDate, endDate) {
        var bookingCriteria = {};
        if (startDate) {
            bookingCriteria.startDate = startDate;
        }

        if (endDate) {
            bookingCriteria.endDate = endDate;
        }

        return bookingCriteria;
    }

    // Get a booking -- placeholder!
    BookingService.prototype.getBooking = function (bookingDetails) {
        var self = this,
            startDate = _.has(bookingDetails, 'startDate') ? bookingDetails.startDate : null,
            endDate = _.has(bookingDetails, 'endDate') ? bookingDetails.endDate : null;

        var bookingCriteria = getBookingCriteria(startDate, endDate);

        return self.BookingModel.find(bookingCriteria, function (err, bookings) {
            if (err) {
                console.log('Found Error');
                console.log(err);
            }
            console.log('Found bookings: ', bookings, null, 2);
            return bookings;
        });
    };

    // Helper function to get the start date
    // Takes a date string in format: YYYY-mm-dd
    function getStartDate (dateStr) {
        return moment(dateStr + "T00:00:00", moment.ISO_8601);
    }

    // Helper function to get the end date
    // Takes a date string in format: YYYY-mm-dd
    function getEndDate (dateStr) {
        return moment(dateStr + "T23:59:59", moment.ISO_8601);
    }

    /**
     * Create a booking, spliting a booking request to n booking records
     * @param: {bookingDetails}
     * returns [{nBookingInstances}]
     */
    BookingService.prototype.createBooking = function (bookingDetails) {
        var self = this,
            createDate = Date.now(),
            bookingDetails = typeof bookingDetails === 'string' ? JSON.parse(bookingDetails) : bookingDetails;

        return self.getRequestorId(bookingDetails.requestor)
            .then(function (requestorId) {
                // Prepare n booking records by forking the booking request accorrding to the repeat criteria
                var nBookingRecords =  self.forkBookingRecords(bookingDetails, requestorId);

                // Save these records
                return Promise.map(nBookingRecords, function (bookingRecord) {
                    return self.saveBookingRecord(bookingRecord);
                })
                .then(function (bookingRecords) {
                    console.log('Booking Records created: ', bookingRecords, null, 2);
                    return Promise.resolve(bookingRecords);
                })
                .catch(function (error) {
                    return Promise.reject(error);
                });
            })
            .catch(function (error) {
                console.log('Error while saving n booking records: ' + error);
                return Promise.reject(error);
            });
    };

    /**
     * Checks if the requestor exists in the 'requestor' collection, creates the requestor if 
     * it doesn't, updates the requestor document otherwise
     * @param: {bookingDetails}
     * returns: {nbookingRecords}
     */
    BookingService.prototype.getRequestorId = function (bookingRequestor) {
        var self = this;
        
        return self.RequestorModel
            .findOne({ email: bookingRequestor.email })
            .exec()
            .then(function (requestor) {
                if (!requestor) {
                    requestor = new self.RequestorModel();
                }

                // Insert update the requestor details
                if (_.has(bookingRequestor, 'name.first')) {    
                    _.set(requestor, 'name.first', bookingRequestor.name.first);
                }

                if (_.has(bookingRequestor, 'name.last')) {
                    _.set(requestor, 'name.last', bookingRequestor.name.last);
                }

                if (_.has(bookingRequestor, 'phone')) {
                    requestor.phone = bookingRequestor.phone;
                }
                // save should return an mpromise object
                return requestor.save();
            })
            .then(function (refurbedRequestor) {
                // Rseolve with requestor id
                return Promise.resolve(refurbedRequestor._id);
            })
            .catch(function (err) {
                console.log('Error while playing with requestor for booking: ', err);
                return Promise.reject(err);
            });
    };

    /**
     * Get a mognoose instance of the booking record
     * @param: {bookingDetails}
     * returns: {nbookingRecords}
     */
    BookingService.prototype.forkBookingRecords = function (bookingDetails, requestorId) {
        var nBookingRecords = [],
            createDate = Date.now(),
            purpose = bookingDetails.purpose,
            status = bookingDetails.status,
            priority = bookingDetails.priority,
            startDate = getStartDate(bookingDetails.startDate),
            endDate = getEndDate(bookingDetails.endDate),
            startTime = bookingDetails.startTime.split(':'),
            endTime = bookingDetails.endTime.split(':'),
            startHour = parseInt(startTime[0]),
            startMin = parseInt(startTime[1]),
            endHour = parseInt(endTime[0]),
            endMin = parseInt(endTime[1]),
            repeatCritera = _.has(bookingDetails, repeatCritera) ? parseInt(bookingDetails.repeatCritera) : 1;

        // @TO-DO:
        // Trigger error if start time / end time doesn't exist

        var date = startDate;
        while (date <= endDate) {
            var bookingRecord = new this.BookingModel();

            date.hour(startHour);
            date.minute(startMin);
            bookingRecord.startTime = date;

            // Clone the moment-wrapped date object i.e. start time to obtain end time for that date
            var endDateTime = date.clone();
            endDateTime.hour(endHour);
            endDateTime.minute(endMin);
            bookingRecord.endTime = endDateTime;

            bookingRecord.createDate = createDate;
            bookingRecord.requestor = requestorId;

            if (purpose) {
                bookingRecord.purpose = purpose;
            }
            if (status) {
                bookingRecord.status = status;
            }
            if (priority) {
                bookingRecord.priority = priority;
            }

            nBookingRecords.push(bookingRecord);
            // Increment date
            date.add(repeatCritera, 'days');
        }

        return nBookingRecords;
    };

    /**
     * Save the booking record
     * @param: {bookingRecord}
     * returns: Promisified{bookingRecord}
     */
    BookingService.prototype.saveBookingRecord = function (bookingRecord) {
        return bookingRecord.save()
            .then(function (booking) {
                // console.log('Booking created: ', booking, null, 2);
                return Promise.resolve(booking);
            })
            .catch(function (err) {
                console.log('Err: ', err, null, 2);
                return Promise.reject(err);
            });
    };

    return new BookingService();
};