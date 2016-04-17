'use strict';

angular
    .module('booking')
    .controller('BookingController', ['$rootScope', '$scope', '$state', '$http', '$stateParams', '$filter', 'BookingService', '$location', 'Flash', 'lodash',
        function ($rootScope, $scope, $state, $http, $stateParams, $filter, BookingService, $location, Flash, _) {

            $scope.isCreateBookingState = function () {
                return $state.current.name === 'booking.create';
            };

            // Helper function to filter the date based on a particular format
            function getFormattedDate(date) {
                return $filter('date')(date, 'yyyy-MM-dd');
            }

            function getBookingCriteria() {
                var bookingCriteria = {};

                if ($scope.startDate) {
                    bookingCriteria.startDate = getFormattedDate($scope.startDate);
                }

                if ($scope.endDate) {
                    bookingCriteria.endDate = getFormattedDate($scope.endDate);
                }

                return bookingCriteria;
            }

            // Gets the booking data and calls the respective function based on the location path.
            // Clicking "Find Rooms" submit button => Get the available spaces
            // Clicking "Find Bookings" submit button
            $scope.getRespectiveBookingData = function () {
                var path = $location.path(),
                    bookingDetails = getBookingCriteria();

                if (path == '/booking/create') {
                    $scope.getAvailableSpaces(bookingDetails);
                } else if (path == '/booking/cancel') {
                    console.log('Get Cancel Booking data');
                }
            };

            // Get Bookings based on the booking criteria
            $scope.getBookings = function (bookingDetails) {

                BookingService.getBookings(bookingDetails)
                    .then(
                        function (bookings) {
                            console.log('Bookings: ', bookings);
                            $scope.bookings = bookings;
                        },
                        function (err) {
                            console.log('Error while getting spaces: ', err, null, 2);
                            // Redirect to a dedicated Error page!
                        });
            };

            // Get the available spaces based on the booking criteria
            $scope.getAvailableSpaces = function (bookingDetails) {

                BookingService.getAvailableSpaces(bookingDetails)
                    .then(
                        function (availableSpaceRes) {
                            console.log('Available spaces: ', availableSpaceRes);
                            $scope.availableSpaces = availableSpaceRes.data;
                        },
                        function (err) {
                            console.log('Error while getting available spaces: ', err, null, 2);
                        });
            };

            // Populate the booking scope with the selected space
            $scope.selectSpace = function (space) {
                console.log('Selected Space: ', space, null, 2);
                $scope.selectedSpace = space;
            };

            // Check if booking details entered are sufficient to create a new booking
            function requiredDetailsMissing (bookingDetails) {
                var message = '<strong>Enter Required Fields for Booking: </strong>',
                    detailsMissing = false;

                if (!bookingDetails.startTime || !bookingDetails.endTime) {
                    detailsMissing = true;
                    message += "'Start Time' 'End Time'";
                }

                if (!_.has(bookingDetails, 'requestor.email')) {
                    detailsMissing = true;
                    message += " 'Requestor Email'";
                }

                if (detailsMissing) {
                    Flash.create('danger', message);
                }

                return detailsMissing;
            };

            // Create a new booking
            $scope.createBooking = function () {
                var bookingDetails = getBookingCriteria();
                bookingDetails.roomNumber = $scope.selectedSpace.roomNumber;

                if (requiredDetailsMissing(bookingDetails)) {
                    return;
                }

                bookingDetails.requestor = { "email": "jannunzi@gmail.com", "first": "Josela" };
                bookingDetails.startTime = "18:00";
                bookingDetails.endTime = "21:00";
                
                console.log('Booking Details POST: ', bookingDetails, null, 2);

                BookingService.createBooking(bookingDetails)
                    .then(
                        function (newBookingRes) {
                            console.log('Booking Created: ', newBookingRes);
                            $scope.newBooking = newBookingRes.data;
                        },
                        function (err) {
                            console.log('Error while creating a new booking: ', err, null, 2);
                        });
            };

            /**
             * Go to a particular state route
             * @param route
             */
            $scope.go = function (route) {
                // console.log('Going to route: ' + route);
                $state.go(route);
            };
        }
    ]);
