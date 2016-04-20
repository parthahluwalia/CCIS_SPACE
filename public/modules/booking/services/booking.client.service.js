'use strict';

// Service that provides helper functions for Space Controller
angular
    .module('booking')
    .factory('BookingService', ['$http', '$q', 'lodash',
        function ($http, $q, _) {
            // Provide service functions as closure
            return {
                getBookings: getBookings,
                getAvailableSpaces: getAvailableSpaces,
                createBooking: createBooking,
                groupBookingsByRoom: groupBookingsByRoom,
                cancelBooking: cancelBooking,
                getSplicedBookingList: getSplicedBookingList,
                formatBookingsTimes: formatBookingsTimes
            };

            // Get bookings based on the booking details
            function getBookings (bookingDetails) {
                var deferred = $q.defer();

                $http.get('/api/booking', { params: bookingDetails })
                    .then (
                        function (bookingsRes) {
                            var bookings = bookingsRes.data;
                            deferred.resolve(bookings);
                        }, 
                        function (err) {
                            // Trigger Error
                            console.log('Error while getting bookings', err, null, 2);
                            deferred.reject(err);
                        });

                return deferred.promise;
            }

            function groupBookingsByRoom (bookings) {
                var roomBookings = _.groupBy(bookings, function (booking) {
                    return booking.room.roomNumber;
                });

                console.log('Grouped Bookings: ', roomBookings, null, 2);
                return roomBookings;
            }

            // Get the available spaces based on the booking criteria
            function getAvailableSpaces (bookingDetails) {
                return $http.get('/api/booking/available-space', { params: bookingDetails });
            }

            // Helper function to get the created booking (with proper start and end dates)
            function getCreatedBooking (bookings) {
                var newBooking = {},
                    startBooking = _.minBy(bookings, 'startTime'),
                    minStartTimeStr = startBooking.startTime,
                    maxEndTimeStr = _.maxBy(bookings, 'endTime').endTime,
                    startTime = moment(minStartTimeStr, moment.ISO_8601),
                    endTime = moment(maxEndTimeStr, moment.ISO_8601),
                    multipleDayBooking = true,
                    startDate = startTime.format('ll'),
                    endDate = endTime.format('ll'),
                    day = startTime.format('dddd');

                if (bookings.length === 1) {
                    multipleDayBooking = false;
                }

                if (multipleDayBooking) {
                    day = day + 's';
                }

                newBooking.multipleDayBooking = multipleDayBooking;
                newBooking.day = day;
                newBooking.startDate = startDate;
                newBooking.endDate = endDate;
                newBooking.purpose = startBooking.purpose;
                newBooking.priority = startBooking.priority;

                newBooking.nBookings = bookings;

                return newBooking;
            }

            // Create a new booking
            function createBooking (bookingDetails) {
                var deferred = $q.defer();
                $http.post('/api/booking', bookingDetails)
                    .then (
                        function (bookingRes) {
                            var bookings = bookingRes.data,
                                newBooking = getCreatedBooking(bookings);

                            deferred.resolve(newBooking);
                        },
                        function (err) {
                            // Trigger Error
                            console.log('Error while creating a new booking', err, null, 2);
                            deferred.reject(err);
                        });
                return deferred.promise;
            }

            // Cancel a booking
            function cancelBooking (booking) {
                var bookingIdParams = { bookingId: booking.bookingId };
                return $http.delete('/api/booking', { params: bookingIdParams });
            }

            // Remove a booking from the booking list and return the spliced list
            function getSplicedBookingList (bookings, bookingId) {
                var removedBooking = _.remove(bookings, function (booking) {
                    return booking.bookingId == bookingId;
                });

                return bookings;
            }

            // Helper function to get the date
            function getFormattedDate(date) {
                return moment(date).format('ll');
            }

            // Helper function to get the local time - eg. "11:00 AM"
            function getLocalTime (date) {
                return moment(date).format('LT');
            }

            // Format dates in bookings
            function formatBookingsTimes (bookings) {
                _.forEach(bookings, function (booking) {
                    booking.formattedDate = getFormattedDate(booking.startTime);
                    booking.formattedFromTime = getLocalTime(booking.startTime);
                    booking.formattedToTime = getLocalTime(booking.endTime);
                });

                console.log('Formatted Bookings: ', bookings, null, 2);
            }
            
        }
    ]);