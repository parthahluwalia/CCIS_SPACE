'use strict';

angular
    .module('booking')
    .controller('BookingController', ['$rootScope', '$scope', '$state', '$http', '$stateParams', '$filter', 'BookingService', '$location', 'Flash', 'lodash',
        function ($rootScope, $scope, $state, $http, $stateParams, $filter, BookingService, $location, Flash, _) {

            // We are working with nested (ui-view) scopes, so intitialize the requestor object, so that 
            // the respective (requestor) ng-model will first read and then write the property on it. 
            $scope.requestor = {};
            $scope.newBooking = null;

            $scope.isCreateBookingState = function () {
                return $state.current.name === 'booking.create';
            };

            // Helper function to filter the date based on a particular format
            function getFormattedDate(date) {
                return $filter('date')(date, 'yyyy-MM-dd');
            }

            // Get hh:mm time from a date
            function getHHMM (date) {
                var dateMoment = moment(date);
                return dateMoment.hour() + ':' + dateMoment.minute();
            }

            // Prepares a booking criteria to find bookings / available spaces
            function getBookingDetails() {
                var bookingDetails = {};

                if ($scope.startDate) {
                    bookingDetails.startDate = getFormattedDate($scope.startDate);
                }

                if ($scope.endDate) {
                    bookingDetails.endDate = getFormattedDate($scope.endDate);
                }

                if ($scope.fromTime) {
                    bookingDetails.startTime = getHHMM($scope.fromTime);
                }

                if ($scope.toTime) {
                    bookingDetails.endTime = getHHMM($scope.toTime);
                }

                if ($scope.roomCapacity) {
                    bookingDetails.roomCapacity = $scope.roomCapacity;
                }

                if ($scope.projector) {
                    bookingDetails.projector = true;
                }

                if ($scope.blueJeans) {
                    bookingDetails.blueJeans = true;
                }

                if ($scope.requestor.email) {
                    _.set(bookingDetails, 'requestor.email', $scope.requestor.email);
                }

                if ($scope.requestor.phone) {
                    _.set(bookingDetails, 'requestor.phone', $scope.requestor.phone);
                }

                if($scope.requestor.first) {
                    _.set(bookingDetails, 'requestor.first', $scope.requestor.first);
                }

                if ($scope.requestor.last) {
                    _.set(bookingDetails, 'requestor.last', $scope.requestor.last);
                }

                // console.log('Booking Details: ', bookingDetails, null, 2);

                return bookingDetails;
            }

            // Gets the booking data and calls the respective function based on the location path.
            // Clicking "Find Rooms" submit button => Get the available spaces
            // Clicking "Find Bookings" submit button
            $scope.getRespectiveBookingData = function () {
                var path = $location.path(),
                    bookingDetails = getBookingDetails();

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
                            console.log('Available space Res: ', availableSpaceRes);
                            $scope.availableSpaces = availableSpaceRes.data;

                            if ($scope.availableSpaces.length < 1) {
                                Flash.create('warning', "No space is available for the specified times.");
                            }
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
                var bookingDetails = getBookingDetails();
                bookingDetails.roomNumber = $scope.selectedSpace.roomNumber;

                if (requiredDetailsMissing(bookingDetails)) {
                    return;
                }
                
                BookingService.createBooking(bookingDetails)
                    .then (
                        function (newBooking) {
                            console.log('Booking Created: ', newBooking);
                            $scope.newBooking = newBooking;

                            BookingService.getAvailableSpaces(bookingDetails)
                                .then (
                                    function (availableSpaceRes) {
                                        console.log('Available space Res: ', availableSpaceRes);
                                        $scope.availableSpaces = availableSpaceRes.data;
                                    },
                                    function (err) {
                                        console.log('Error while getting available spaces: ', err, null, 2);
                                    });
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
                $state.go(route);
            };
        }
    ]);
