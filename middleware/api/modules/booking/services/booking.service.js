'use strict';

var Promise = require('bluebird'),
    _ = require('lodash'),
    moment = require('moment');

module.exports = function (ccisroomDb) {
    
    // Global Variables to be used within the service
    var BOOKING_CONFIRMED = 'confirmed',
        BOOKING_CANCELLED = 'cancelled';

    // Booking Service Constructor
    function BookingService () {
        this.BookingModel = require('../../../database/models/booking.model.js')(ccisroomDb);
        this.RequestorModel = require('../../../database/models/requestor.model.js')(ccisroomDb);
        this.RoomModel = require('../../../database/models/room.model.js')(ccisroomDb);
        this.SpaceService = require('../../space/services/space.service.js')(ccisroomDb);
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

    // Helper to get the timed date (i.e. time added in the date)
    function addTimeToDate (date, time) {
        time = time.split(':');
        date.hour(time[0]);
        date.minute(time[1]);
    }

    /**
     * Helper to find prepare a query to get the bookings
     * @param: {bookingDetails}
     * @param: Moment wrapped date object
     * @param: fromTime
     * @param: toTime
     * @returns: {bookingQuery}
     */
    function getBookingCriteria (bookingDetails, date, fromTime, toTime) {
        var bookingCriteria = {}/*, 
            startDate = _.has(bookingDetails, 'startDate') ? getStartDate(bookingDetails.startDate) : null,
            endDate = _.has(bookingDetails, 'endDate') ? getEndDate(bookingDetails.endDate) : null,
            startTime = bookingDetails.startTime,
            endTime = bookingDetails.endTime*/;

        /*if (startTime) {
            startTime = startTime.split(':');
            startDate.hour(startTime[0]);
            startDate.minute(startTime[1]);
        }

        if (endTime) {
            endTime = endTime.split(':');
            endDate.hour(endTime[0]);
            endDate.minute(endTime[1]);
        }

        if (startDate) {
            // Convert moment wrapped date to JavaScript date
            startDate = startDate.toDate();
            bookingCriteria.startTime = { $gt: startDate };
        }

        if (endDate) {
            // Convert moment wrapped date to JavaScript date
            endDate = endDate.toDate();
            bookingCriteria.endTime = { $lt: endDate };
        }*/

        var startTime = date.clone(),
            endTime = date.clone();

        addTimeToDate(startTime, fromTime);
        addTimeToDate(endTime, toTime);

        // Convert the moment wrapped date object to JavaScript date
        startTime = startTime.toDate();
        endTime = endTime.toDate();

        bookingCriteria = {
            '$or': [
                { 
                    '$and': [
                        { 'startTime': { '$gte': startTime } },
                        { 'startTime': { '$lte': endTime } }
                    ] 
                },
                {
                    '$and': [
                        { 'endTime': { '$lte': endTime } },
                        { 'endTime': { '$gte': startTime } }
                    ]
                }
            ]
        };

        // console.log("Times:: ", startTime, endTime, null, 2);
        if (_.has(bookingDetails, 'priority')) {
            bookingCriteria.priority = bookingDetails.priority;
        }

        bookingCriteria.status = _.has(bookingDetails, 'status') ? bookingDetails.status : 'confirmed';

        return bookingCriteria;
    }


    // WE WILL NEED THIS AT SOME POINT OF TIME!!!
    /**
     * Get the bookings, based on the booking criteria specified in the request
     * @param: {bookingDetails}
     * returns [{booking}]
     */
    /*BookingService.prototype.getBooking = function (bookingDetails) {
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
    };*/

    // Get a list of booking criteria
    function forkBookingDetailsByRepeatCriteria (bookingDetails) {
         
        var fromDate = getStartDate(bookingDetails.startDate),
            toDate = getEndDate(bookingDetails.endDate),
            fromTime = bookingDetails.startTime,
            toTime = bookingDetails.endTime,
            repeatCriteria = bookingDetails.repeatCriteria ? parseInt(bookingDetails.repeatCriteria) : 1,
            date = fromDate,
            bookingCriteriaList = [],
            bookingCriteria;

        while (date <= toDate) {
            bookingCriteria = getBookingCriteria(bookingDetails, date, fromTime, toTime);
            bookingCriteriaList.push(bookingCriteria);

            // Increment date
            date.add(repeatCriteria, 'days');
        }

        return bookingCriteriaList;
    }

    /*
     * Get all the bookings based on the specified booking criteria
     */
    BookingService.prototype.getBookings = function (bookingDetails) {
        var self = this,
            bookingCriteriaList = forkBookingDetailsByRepeatCriteria(bookingDetails);

        return Promise.map(bookingCriteriaList, function (bookingCriteria) {

            // Search for the respective bookings
            return self.BookingModel
                .find(bookingCriteria)
                .exec()
                .then(function (bookings) {
                    /*console.log('Or Condition 1: ', bookingCriteria['$or'][0]['$and'][0], null, 2);
                    console.log('Or Condition 2: ', bookingCriteria['$or'][1]["$and"][1], null, 2);
                    console.log('Got bookings in Service: ', bookings, null, 2);*/
                    // return Promise.resolve(bookings);
                    return Promise.map(bookings, function (booking) {
                        var refurbedBooking = {
                            bookingId: booking._id,
                            purpose: booking.purpose,
                            priority: booking.priority,
                            startTime: booking.startTime,
                            endTime: booking.endTime
                        };

                        return self.getRoomAndRequestorDetails(booking)
                            .then (function (roomAndRequestorDetails) {
                                refurbedBooking.room = roomAndRequestorDetails.spaceDetails;
                                refurbedBooking.requestor = roomAndRequestorDetails.requestorDetails;

                                return Promise.resolve(refurbedBooking);
                            });
                    }, { concurrency: 1 })
                    .catch(function (err) {
                        console.log('Error while fetching room and requestor details: ', err);
                        return Promise.reject(err);
                    });
                })
                .catch(function (err) {
                    console.log('Error while fetching booking details: ', err);
                    return Promise.reject(err);
                });
        }, { concurrency: 1 })
        .then (function (bookingList) {
            // Flatten the list of lists of bookings
            var flattenedBookingList = _.flatten(bookingList);
            console.log('Found bookings List: ', flattenedBookingList, null, 2);
            return Promise.resolve(flattenedBookingList);
        })
        .catch(function (err) {
            console.log('Error while fetching bookings: ', err, null, 2);
            return Promise.reject(err);
        });

    };

    /**
     * Helper function to get the existing bookings 
     */
    BookingService.prototype.getExistingBookingsHelper = function (bookingDetails) {
        var self = this,
            bookingCriteriaList = forkBookingDetailsByRepeatCriteria(bookingDetails);

        return Promise.map(bookingCriteriaList, function (bookingCriteria) {

            // Search for the respective bookings
            return self.BookingModel
                .find(bookingCriteria)
                .exec()
                .then(function (bookings) {
                    return Promise.resolve(bookings);
                })
                .catch(function (err) {
                    console.log('Error while fetching booking details: ', err);
                    return Promise.reject(err);
                });
        }, { concurrency: 1 })
        .then (function (bookingList) {
            // Flatten the list of lists of bookings
            var flattenedBookingList = _.flatten(bookingList);
            console.log('Found bookings List: ', flattenedBookingList, null, 2);
            return Promise.resolve(flattenedBookingList);
        })
        .catch(function (err) {
            console.log('Error while fetching bookings: ', err, null, 2);
            return Promise.reject(err);
        });
    };  

    BookingService.prototype.getRoomAndRequestorDetails = function (booking) {
        var self = this,
            reservation = {};

        return new Promise(function (resolve, reject) {
            return self.SpaceService.getSpaceById(booking.room)
                .then (function (space) {
                    reservation.spaceDetails = space;
                    return self.getRequestorById(booking.requestor);
                })
                .then (function (requestor) {
                    reservation.requestorDetails = requestor;
                    return resolve(reservation);
                })
                .catch(function (err) {
                    console.log('Error while getting space/requestor by Id: ', err, null, 2);
                    return reject(err);
                });
        });
    };

    BookingService.prototype.getRequestorById = function (requestorId) {
        var self = this;

        return self.RequestorModel
            .findOne({ _id: requestorId })
            .exec()
            .then (function (requestor) {
                return Promise.resolve({
                    email: requestor.email,
                    name: requestor.name
                });
            })
            .catch (function (err) {
                console.log('Error while getting requestor by Id: ', err, null, 2);
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
                    console.log('Error while creating booking: ', error, null, 2);
                    return Promise.reject(error);
                });
            })
            .catch(function (error) {
                console.log('Error while saving n booking records: ', error, null, 2);
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
                return Promise.reject(err);
            });
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
        console.log('Booking Details: ', bookingDetails, null, 2);

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
            repeatCriteria = bookingDetails.repeatCriteria ? parseInt(bookingDetails.repeatCriteria) : 1,
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
            date.add(repeatCriteria, 'days');
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


    /**
     * Get the available spaces based on the specified booking criteria
     * @param: {bookingCriteria}
     * returns: Promise[avaibleSpaces]
     */
    BookingService.prototype.getAvailableSpaces = function (bookingDetails) {
        var self = this,
            allSpaces;

        return self.SpaceService.getAllActiveSpaces()
            .then(function (spaces) {
                allSpaces = spaces;

                console.log('Finding bookings based on details: ', bookingDetails, null, 2);
                // Get the current bookings
                return self.getExistingBookingsHelper(bookingDetails);
            })
            .then(function (bookings) {
                var occupiedSpaceIds = _.filter (
                    _.map(bookings, 'room'), 
                    function (spaceId) {
                        return spaceId;
                    });

                console.log('occupied spaces: ', occupiedSpaceIds, null, 2);

                // Filter the spaces, removing the occupied spaces for the specified booking time
                var spaceInstances = _.filter(allSpaces, function (space) {
                    return !_.find(occupiedSpaceIds, function (occupiedSpaceId) {
                        return occupiedSpaceId.equals(space._id);
                    });
                });

                var availableSpaces =  [];
                _.each(spaceInstances, function (spaceInstance) {
                    availableSpaces.push({
                        roomNumber: spaceInstance.roomNumber,
                        description: spaceInstance.description,
                        capacity: spaceInstance.details.capacity,
                        blueJeans: spaceInstance.details.blueJeans,
                        projector: spaceInstance.details.projector
                    });
                });

                return Promise.resolve(availableSpaces);
            })
            .catch(function (err) {
                console.log('Error while getting Available Spaces: ', err, null, 2);
                return Promise.reject(err);
            });

    };

    BookingService.prototype.cancelBookingById = function (bookingId) {
        var self = this;

        return self.BookingModel
            .findById(bookingId)
            .exec()
            .then(function (booking) {
                if(!booking) {
                    return Promise.reject('Booking with _id ', bookingId, 'not found');
                }

                booking.status = BOOKING_CANCELLED;
                return booking.save()
                    .then(function (cancelledBooking) {
                        return Promise.resolve(booking);
                    })
                    .catch(function (err) {
                        console.log('Error while saving booking: ', err, null, 2);
                        return Promise.reject(err);
                    });
            })
            .catch(function (err) {
                return Promise.reject(err);
            });
    };

    return new BookingService();
};