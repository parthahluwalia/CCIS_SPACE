'use strict';

// Service that provides helper functions for Space Controller
angular
    .module('booking')
    .factory('BookingService', ['$http', '$q', 'lodash',
        function ($http, $q, _) {
            var weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

            // Provide service functions as closure
            return {
                getBookings: getBookings,
                getAvailableSpaces: getAvailableSpaces,
                createBooking: createBooking
            };

            // Get space based on the space details
            function getBookings (bookingDetails) {
                var deferred = $q.defer();

                $http.get('/api/booking', { params: bookingDetails })
                    .then (
                        function (bookingsRes) {
                            var bookings = bookingsRes.data;
                            // console.log('Service: ', bookings);
                            deferred.resolve(bookings);
                        }, 
                        function (err) {
                            // Trigger Error
                            console.log('Error while getting bookings', err, null, 2);
                            deferred.reject(err);
                        });

                return deferred.promise;
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

                            console.log('New Booking: ', newBooking, null, 2);

                            deferred.resolve(newBooking);
                        },
                        function (err) {
                            // Trigger Error
                            console.log('Error while creating a new booking', err, null, 2);
                            deferred.reject(err);
                        });
                return deferred.promise;
            }
            
        }
    ]);