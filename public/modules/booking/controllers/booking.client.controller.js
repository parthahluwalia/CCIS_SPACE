'use strict';

angular
    .module('booking')
    .controller('BookingController', ['$rootScope', '$scope', '$state', '$http', '$stateParams', '$filter', 'BookingService', '$location', 'Flash', 'lodash',
        function ($rootScope, $scope, $state, $http, $stateParams, $filter, BookingService, $location, Flash, _) {
            // Global list of bookings - Mainly used while managing the bookings
            var bookingList = [];
            
            // We are working with nested (ui-view) scopes, so intitialize the requestor object, so that 
            // the respective (requestor) ng-model will first read and then write the property on it. 
            $scope.requestor = {};
            $scope.newBooking = null;
            $scope.repeat = {};

            // Return location path
            $scope.getPath = function () {
                return $location.path();
            };

            if ($scope.getPath() == '/booking/manage') {
                $scope.roomBookings = null;
            }

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

            function isValidBooking () {
                var nowDateWithoutTime = new Date(),
                    nowTime = new Date(),
                    nowHours = nowTime.getHours(),
                    nowMins = nowTime.getMinutes(),
                    fromTime = $scope.fromTime,
                    fromHours = fromTime ? fromTime.getHours() : null,
                    fromMins = fromTime ? fromTime.getMinutes() : null,
                    toTime = $scope.toTime,
                    toHours = toTime ? toTime.getHours() : null,
                    toMins = toTime ? toTime.getMinutes() : null,
                    valid = true;

                nowDateWithoutTime.setHours(0,0,0,0);

                if ($scope.startDate < nowDateWithoutTime) {
                    Flash.create('danger', "<strong>Start Date</strong> should be greater than or equal to <strong>today's date</strong>");
                    valid = false;
                }

                if ($scope.endDate < nowDateWithoutTime) {
                    Flash.create('danger', "<strong>End Date</strong> should be greater than or equal to <strong>today's date</strong>");
                    valid = false;
                }

                /*console.log('Start date: ', $scope.startDate, 'Type: ', typeof $scope.startDate);
                console.log('End date: ', $scope.endDate);
                console.log('Start Time: ', fromTime);
                console.log('To Time: ', toTime);
                console.log('Now Date w/o time: ', nowDateWithoutTime, 'Type: ', typeof nowDateWithoutTime);*/

                if ($scope.startDate.getTime() === nowDateWithoutTime.getTime()
                    || $scope.endDate.getTime() === nowDateWithoutTime.getTime()) {

                    if (fromHours && fromHours < nowHours) {
                        Flash.create('danger', "<strong>Start Time</strong> should be greater than the <strong>current time</strong>");
                        valid = false;
                    }

                    if (fromHours && fromHours == nowHours && fromMins < nowMins) {
                        Flash.create('danger', "<strong>Start Time</strong> should be greater than the <strong>current time</strong>");
                        valid = false;
                    }

                    if (toHours && toHours < nowHours) {
                        Flash.create('danger', "<strong>End Time</strong> should be greater than the <strong>current time</strong>");
                        valid = false;
                    }

                    if (toHours && toHours == nowHours && toMins && toMins < nowMins) {
                        Flash.create('danger', "<strong>End Time</strong> should be greater than the <strong>current time</strong>");
                        valid = false;
                    }
                }

                if ($scope.endDate < $scope.startDate) {
                    Flash.create('danger', "<strong>End Date</strong> should be greater than the <strong>Start Date</strong>");
                    valid = false;
                }

                if (toTime && fromTime && toTime < fromTime) {
                    Flash.create('danger', "<strong>End Time</strong> should be greater than the <strong>Start Time</strong>");
                    valid = false;
                }

                /*if (!bookingDetails.startTime || !bookingDetails.endTime) {
                    message += "'Start Time' 'End Time'";
                    valid = false;
                }*/

                return valid;
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

                if ($scope.repeat.value) {
                    bookingDetails.repeatCriteria = $scope.repeat.value;
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
                var path = $scope.getPath(),
                    bookingDetails = getBookingDetails();

                // If booking is invalid, show a Flash message and return
                if (!isValidBooking()) {
                    return;
                }

                if (path == '/booking/create') {
                    $scope.getAvailableSpaces(bookingDetails);
                } else if (path == '/booking/manage') {
                    // console.log('Get Cancel Booking data');
                    $scope.getBookings(bookingDetails);
                }
            };

            // Get Bookings based on the booking criteria
            $scope.getBookings = function (bookingDetails) {

                BookingService.getBookings(bookingDetails)
                    .then(
                        function (bookings) {
                            // console.log('Existing Bookings: ', bookings);
                            if (bookings.length < 1) {
                                Flash.create('warning', 'No Bookings found for the specified times');
                                return;
                            }

                            BookingService.formatBookingsTimes(bookings);

                            bookingList = bookings;
                            $scope.roomBookings = BookingService.groupBookingsByRoom(bookings);
                            // $scope.bookings = bookings;
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
                // console.log('Selected Space: ', space, null, 2);
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
                                        // console.log('Available space Res: ', availableSpaceRes);
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

            // Delete a booking
            $scope.cancelBooking = function (booking) {
                BookingService.cancelBooking(booking)
                    .then (
                        function (cancelledBookingRes) {
                            var cancelledBookingId = cancelledBookingRes.data._id,
                                splicedBookingList = BookingService.getSplicedBookingList(bookingList, cancelledBookingId);
                            
                            $scope.roomBookings = BookingService.groupBookingsByRoom(splicedBookingList);
                        },
                        function (err) {
                            console.log('Error while cancelling booking: ', err);
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
