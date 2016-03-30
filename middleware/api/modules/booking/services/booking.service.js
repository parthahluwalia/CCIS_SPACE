'use strict';

var Promise = require('bluebird'),
    _ = require('lodash'),
    moment = require('moment');

module.exports = function (ccisroomDb) {

    // Booking Service Constructor
    function BookingService () {
        this.BookingModel = require('../../../database/models/booking.model.js')(ccisroomDb);
        this.RequestorModel = require('../../../database/models/requestor.model.js')(ccisroomDb);
        this.RoomModel = require('../../../database/models/room.model.js')(ccisroomDb);
    }

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
     * Helper to find prepare a query to get the bookings
     * @param: {bookingDetails}
     * @returns: {bookingQuery}
     */
    function getBookingCriteria (bookingDetails) {
        var bookingCriteria = {},
            startDate = _.has(bookingDetails, 'startDate') ? getStartDate(bookingDetails.startDate) : null,
            endDate = _.has(bookingDetails, 'endDate') ? getEndDate(bookingDetails.endDate) : null;

        if (startDate) {
            bookingCriteria.startTime = { $gt: startDate };
        }

        if (endDate) {
            bookingCriteria.endTime = { $lt: endDate };
        }

        if (_.has(bookingDetails, 'priority')) {
            bookingCriteria.priority = bookingDetails.priority;
        }

        if (_.has(bookingDetails, 'status')) {
            bookingCriteria.status = bookingDetails.status;
        }

        return bookingCriteria;
    }

    /**
     * Get the bookings, based on the booking criteria specified in the request
     * @param: {bookingDetails}
     * returns [{nBookingInstances}]
     */
    BookingService.prototype.getBooking = function (bookingDetails) {
        var self = this,
            bookingCriteria = getBookingCriteria(bookingDetails),
            // How to take the requestor here? --> Maybe a stringified object!
            requestor = _.has(bookingDetails, 'requestor') ? bookingDetails.requestor : null,
            roomNumber = _.has(bookingDetails, 'roomNumber') ? bookingDetails.roomNumber : null;

        // First look for a filtering criteria, to build the results, which may be the following:
        //  - roomNumber
        //  - requestor
        // and then search for the respective bookings
        return self.getRoomIdByNumber(roomNumber)
            .then(function (roomId) {
                if (roomId) {
                    bookingCriteria.room = roomId;
                }
                return self.getRequestorIds(requestor)     
            })
            .then(function (requestorIds) {
                if (_.size(requestorIds) > 0) {
                    bookingCriteria.requestor = { $in: requestorIds };
                }

                return self.BookingModel
                    .find(bookingCriteria)
                    .exec();
            })
            .then(function (bookings) {
                console.log('Got bookings in Service: ', bookings.length, null, 2);
                return Promise.resolve(bookings);
            })
            .catch(function (err) {
                console.log('Error while fetching booking records: ', err);
                return Promise.reject(err);
            });
    };

    // Helper function to build the query to get the requestor(s)
    // We can get a requestor by email and by name (first and last)
    function getRequestorCriteria (bookingRequestor) {
        bookingRequestor = typeof bookingRequestor === 'string' ? JSON.parse(bookingRequestor) : bookingRequestor;
        var requestorCriteria = {};

        if (_.has(bookingRequestor, 'email')) {
            requestorCriteria.email = bookingRequestor.email;
        }

        if (_.has(bookingRequestor, 'name.first')) {
            requestorCriteria["name.first"] = bookingRequestor.name.first;
        }

        if (_.has(bookingRequestor, 'name.last')) {
            requestorCriteria["name.last"] = bookingRequestor.name.last;
        }

        return requestorCriteria;
    }

    /**
     * Returns a list of requestor ids
     * @param: requestor (stringified object)
     * @returns: [requestorIds]
     */
    BookingService.prototype.getRequestorIds = function (bookingRequestor) {
        var requestorCriteria;

        if (!bookingRequestor) {
            return Promise.resolve(null);
        }

        requestorCriteria = getRequestorCriteria(bookingRequestor);

        return this.RequestorModel
            .find(requestorCriteria)
            .exec()
            .then(function (requestorList) {
                console.log('Requestor List: ', requestorList, null, 2);

                var requestorIds = _.map(requestorList, '_id');
                return Promise.resolve(requestorIds);
            })
            .catch(function (err) {
                console.log('Error while getting requestor(s): ', err, null, 2);
                return Promise.reject(err);
            });
    };

    /**
     * Helper function to get a room id
     * @param: roomNumber
     */
    BookingService.prototype.getRoomId = function (roomNumber) {
        return this.RoomModel
            .findOne({ roomNumber: roomNumber })
            .exec()
            .then(function (room) {
                if (!room) {
                    // @To-Do: Graceful handling of rooms not found!
                    return Promise.reject('Room ' + roomNumber + ' not found in the database');
                }

                console.log('Room found: ', room);

                return Promise.resolve(room._id);
            })
            .catch(function (err) {
                return Promise.reject(err);
            });
    }

    /**
     * Get Room Id for a specified room number : GET Request Handler
     * @param: roomNumber
     */
    BookingService.prototype.getRoomIdByNumber = function (roomNumber) {
        if (!roomNumber) {
            return Promise.resolve(null);
        }

        return this.getRoomId(roomNumber)
            .then(function (roomId) {
                return Promise.resolve(roomId);
            })
            .catch(function (err) {
                return Promise.reject(roomId);
            });
    };

    /**
     * Create a booking, spliting a booking request to n booking records
     * @param: {bookingDetails}
     * returns [{nBookingInstances}]
     */
    BookingService.prototype.createBooking = function (bookingDetails) {
        var self = this,
            createDate = Date.now(),
            bookingDetails = typeof bookingDetails === 'string' ? JSON.parse(bookingDetails) : bookingDetails,
            roomId;

        return self.getRoomIdForBooking(bookingDetails.roomNumber)
            .then(function (bookingRoomId) {
                roomId = bookingRoomId;
                console.log('Room Id: ', roomId);
                return self.getRequestorId(bookingDetails.requestor);
            })
            .then(function (requestorId) {
                console.log('Requestor Id: ', requestorId);
                // Prepare n booking records by forking the booking request accorrding to the repeat criteria
                var nBookingRecords = self.forkBookingRecords(bookingDetails, roomId, requestorId);

                // Save these records
                return Promise.map(nBookingRecords, function (bookingRecord) {
                    return self.saveBookingRecord(bookingRecord);
                })
                .then(function (bookingRecords) {
                    // console.log('Booking Records created: ', bookingRecords, null, 2);
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

            // We also need to close the db connection
    };

    BookingService.prototype.getRoomIdForBooking = function (roomNumber) {
        if (!roomNumber) {
            return Promise.reject({ err: 'Not found: Booking request should contain a room number' });
        }

        return this.getRoomId(roomNumber)
            .then(function (roomId) {
                return Promise.resolve(roomId);
            })
            .catch(function (err) {
                return Promise.reject(roomId);
            });

        /*return this.RoomModel
            .findOne({ roomNumber: roomNumber })
            .exec()
            .then(function (room) {
                if (!room) {
                    return Promise.reject('Room ' + roomNumber + ' not found in the database');
                }

                return Promise.resolve(room._id);
            })
            .catch(function (err) {
                return Promise.reject(err);
            });*/
    };

    /**
     * Checks if the requestor exists in the 'requestor' collection, creates the requestor if 
     * it doesn't, updates the requestor document otherwise
     * @param: {bookingDetails}
     * returns: {RequestorId}
     */
    BookingService.prototype.getRequestorId = function (bookingRequestor) {
        var self = this;
        // Check if requestor's email is not specified.
        if (!_.has(bookingRequestor, 'email')) {
            return Promise.reject({ err: 'A request must specify the requestor\'s email'})
        }

        return self.RequestorModel
            .findOne({ email: bookingRequestor.email })
            .exec()
            .then(function (requestor) {
                if (!requestor) {
                    console.log('New Requestor! Creating a requestor record');
                    requestor = new self.RequestorModel();
                    requestor.email = bookingRequestor.email;
                } else {
                    console.log('Requestor exists, Updating record!');
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
    BookingService.prototype.forkBookingRecords = function (bookingDetails, roomId, requestorId) {
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
            repeatCritera = _.has(bookingDetails, repeatCritera) ? parseInt(bookingDetails.repeatCritera) : 1,
            bookingRecord;

        // @TO-DO:
        // Trigger error if start time / end time doesn't exist

        var date = startDate;
        while (date <= endDate) {
            bookingRecord = new this.BookingModel();

            date.hour(startHour);
            date.minute(startMin);
            bookingRecord.startTime = date;

            // Clone the moment-wrapped date object i.e. start time to obtain end time for that date
            var endDateTime = date.clone();
            endDateTime.hour(endHour);
            endDateTime.minute(endMin);
            bookingRecord.endTime = endDateTime;

            bookingRecord.createDate = createDate;
            bookingRecord.room = roomId;
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