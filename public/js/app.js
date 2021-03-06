'use strict';

// Init the application configuration module for AngularJS App
var ApplicationConfiguration = (function () {
    // Init module configuration options
    var appModuleName = 'ccisroomscheduler',
        appModuleVendorDependencies = ['ngResource', 'ngCookies', 'ngAnimate', 'ngTouch', 'ui.router'];

    // Add a new vertical module
    var registerModule = function (moduleName, dependencies) {
        // Create angular module
        angular
            .module(moduleName, dependencies || []);

        // Add the reqistered module to the list of vertical modules for the main app module
        angular
            .module(appModuleName)
            .requires
            .push(moduleName);
    };

    // Wrap required info in a closure
    return {
        appModuleName: appModuleName,
        appModuleVendorDependencies: appModuleVendorDependencies,
        registerModule: registerModule
    };

})();
'use strict';

angular
    .module(ApplicationConfiguration.appModuleName, ApplicationConfiguration.appModuleVendorDependencies);

// Setting HTML5 Location Mode
angular
    .module(ApplicationConfiguration.appModuleName)
    .config(['$locationProvider', 
        function($locationProvider) {
            $locationProvider.hashPrefix('!');
        }
    ])
    .run(['$http', '$cookies', '$rootScope', '$state',
        function ($http, $cookies, $rootScope, $state) {
            // Track the beginning and end of all angular-invoked AJAX requests
            $http.defaults.transformRequest.push(function (data) {
                $rootScope.$broadcast('httpCallStarted');
                return data;
            });
            $http.defaults.transformResponse.push(function(data){
                $rootScope.$broadcast('httpCallStopped');
                return data;
            });
        }
    ]);

//Then define the init function for starting up the application
angular
    .element(document)
    .ready(function() {
        // Workaround for redirect bug that arises in OAuth2.0 sign-ups!
        if (window.location.hash === '#_=_') {
            window.location.hash = '#!';
        }

        //Then init the app
        angular.bootstrap(document, [ApplicationConfiguration.appModuleName]);
    });
'use strict';
// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('booking');
'use strict';
// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';
// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('home');
'use strict';
// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('user');
'use strict';
// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('space');
'use strict';

// Setting up route
angular
    .module('booking', ['ngFlash', 'ngAnimate', 'ui.bootstrap'])
    .config(['$stateProvider',
        function($stateProvider) {
            // Booking state routing
            $stateProvider
                .state('booking', {
                    url: '/booking',
                    templateUrl: 'modules/booking/views/booking.client.view.html',
                    controller: 'BookingController',
                    redirectTo: 'booking.create'
                })
                .state('booking.create', {
                    url: '/create',
                    templateUrl: '/modules/booking/views/partials/create-booking.client.view.html',
                    params: {
                        protected: true
                    }
                })
                .state('booking.manage', {
                    url: '/manage',
                    templateUrl: '/modules/booking/views/partials/cancel-booking.client.view.html',
                    params: {
                        protected: true
                    }
                });
        }
    ]);
'use strict';

angular
    .module('booking')
    .controller('BookingController', ['$rootScope', '$scope', '$state', '$http', '$stateParams', '$filter', 'BookingService', '$location', 'Flash', 'lodash', '$uibModal', '$log',
        function ($rootScope, $scope, $state, $http, $stateParams, $filter, BookingService, $location, Flash, _, $uibModal, $log) {
            // Global list of bookings - Mainly used while managing the bookings
            var bookingList = [];
            
            // We are working with nested (ui-view) scopes, so intitialize the requestor object, so that 
            // the respective (requestor) ng-model will first read and then write the property on it. 
            $scope.requestor = {};
            $scope.newBooking = null;
            $scope.repeat = {};

            $scope.animationsEnabled = true;

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

                if ($scope.getPath() == '/booking/create') {
                    if ($scope.startDate < nowDateWithoutTime) {
                        Flash.create('danger', "<strong>Start Date</strong> should be greater than or equal to <strong>today's date</strong>");
                        valid = false;
                    }

                    if ($scope.endDate < nowDateWithoutTime) {
                        Flash.create('danger', "<strong>End Date</strong> should be greater than or equal to <strong>today's date</strong>");
                        valid = false;
                    }

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
                }

                if ($scope.endDate < $scope.startDate) {
                    Flash.create('danger', "<strong>End Date</strong> should be greater than the <strong>Start Date</strong>");
                    valid = false;
                }

                if (toTime && fromTime && toTime < fromTime) {
                    Flash.create('danger', "<strong>End Time</strong> should be greater than the <strong>Start Time</strong>");
                    valid = false;
                }

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

            $scope.getLocalTime = function (date) {
                return moment(date).format('LT');
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


            // Cancel Booking Modal Code
            $scope.confirmBookingCancellation = function (selectedBooking) {
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'cancel-booking-modal.html',
                    controller: 'ModalInstanceCtrl',
                    resolve: {
                        selectedBooking: function () {
                            return selectedBooking;
                        }
                    }
                });

                modalInstance.result
                    .then (
                        function (selectedBooking) {
                            // $scope.selectedBooking = selectedBooking;
                            $scope.cancelBooking(selectedBooking);
                        }, 
                        function () {
                            $log.info('Modal dismissed at: ' + new Date());
                    });
            };
        }
    ]);

'use strict';

angular
    .module('booking')
    .controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, selectedBooking, BookingService) {
        console.log('ModalInstanceCtrl called!!!', selectedBooking, null, 2);

  /*$scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };*/
        $scope.selectedBooking = selectedBooking;

        $scope.ok = function () {
          $uibModalInstance.close($scope.selectedBooking);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
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

                /*if (multipleDayBooking) {
                    day = day + 's';
                }*/

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
'use strict';

//Setting up route
angular
    .module('core')
    .config(['$urlRouterProvider', '$stateProvider',
        function($urlRouterProvider, $stateProvider) {
            // Redirect to home view when route not found
            $urlRouterProvider.otherwise('/');
        }
]);
'use strict';

angular
    .module('core')
    .run(['$state', '$rootScope',
        function ($state, $rootScope) {
            // Handle default child routes
            $rootScope.$on('$stateChangeStart', function(event, toState, stateParams) {
                if (toState.redirectTo) {
                    event.preventDefault();
                    $state.go(toState.redirectTo, stateParams);
                }
            });

            // Redirect to login state
            $rootScope.loginRedirect = function () {
                $state.go('login');
            };

            // Redirect to home
            $rootScope.homeRedrect = function () {
                $state.go('home');
            }

            // On state change, check if a route is protected and user is not logged in, redirect to login, if yes
            $rootScope.$on('$stateChangeSuccess', function(event, toState, toStateParams, fromState, fromStateParams) {
                if (toStateParams.protected && !$rootScope.user) {
                    $rootScope.loginRedirect();           
                }

                if ($rootScope.user && toStateParams.superUserOnly && !$rootScope.user.isSuperUser) {
                    $rootScope.homeRedrect();
                }
            });
        }
    ]);
'use strict';

angular
    .module('core')
    .controller('MainController', ['$scope', '$rootScope', '$controller', '$location', '$window', '$anchorScroll', '$state', 'lodash', 'UserService',
        function ($scope, $rootScope, $controller, $location, $window, $anchorScroll, $state, _, UserService) {

            // Check if a user is an admin
            $scope.isAdmin = function (user) {
                console.log('/location.path: ', $location.path());
                console.log('RootScope User Tags: ', $rootScope.user.tags, null, 2);
                var adminTag = _.find(user.tags, function (tag) {
                    return tag === "admin";
                });
                
                if (!adminTag) {
                    return false;
                }

                return true;
            };

            // Log a user out
            $scope.logout = function () {
                UserService.logout()
                    .then (
                        function (logoutRes) {
                            console.log('Logout successful: ', logoutRes, null, 2);
                            $rootScope.user = null;
                            // Redirect to 'home' state
                            $state.go('home');
                        },
                        function (err) {
                            console.log('Error while log out: ', err, null, 2);
                        });
            };

            // Redirect to login page
            $scope.loginRedirect = function () {
                console.log('Redirecting to login state');
                $state.go('login');
            };

            /**
             * Go to url-hash
             * @param hash
             * @todo Move this to a proper controller scope
             */
            $rootScope.goHash = function (hash) {
                $location.hash(hash);
                $anchorScroll();
            };

            // Collapsing the menu after navigation -- Not working!! Might want to do a $broadcast
            // Handled at the rootScope for now in core.client.run!
            /*$scope.on('$stateChangeSuccess', function (e, toState) {
                //For protected routes, redirect the user to the login page
                if ($state.params.protected && !$rootScope.user) {
                    $scope.loginRedirect();
                }
            });*/

        }
    ]);
'use strict';

// Factory Service to use Lodash in the browser
angular
    .module('core')
    .factory('lodash', ['$window',
        function ($window) {
            return $window._;
        }
    ]);
'use strict';

// Setting up route
angular
    .module('home')
    .config(['$stateProvider',
        function($stateProvider) {
            // Home state routing
            $stateProvider
                .state('home', {
                    url: '/',
                    templateUrl: 'modules/home/views/home.client.view.html'
                });
        }
    ]);
'use strict';

angular
    .module('user')
    .controller('LoginController', ['$scope', '$http', 'UserService', '$rootScope', 'Flash', '$state',
    	function ($scope, $http, UserService, $rootScope, Flash, $state) {

    		// Function to log a user in
    		// If credentials legit, redirect to state 'booking'
    		// Display a flash message otherwise
    		$scope.login = function () {
    			UserService.login($scope.userEmail, $scope.userPassword)
    				.then (
    					function (userRes) {
    						console.log('Logged in: ', userRes, null, 2);
                            var loggedInUser = userRes.data;
    						// Populate the user in the rootScope
    						$rootScope.user = loggedInUser;
                            $rootScope.user.isSuperUser = UserService.isSuperUser(loggedInUser.tags);

    						// Redirect to booking state
    						$state.go('booking');
    					},
    					function (err) {
    						// console.log('Errored user: ', err, null, 2);
    						var message = "<strong>" + err.statusText + "! </strong>";

    						if (err.status === 401) {
    							message += err.data.message;
    						}

    						Flash.create('danger', message);
    					});
    		};

    	}
    ]);
'use strict';

angular
    .module('user')
    .controller('UserController', ['$scope', '$http', 'UserService',
        function ($scope, $http, UserService) {
            var userList = [];

            $scope.user = {};
            $scope.users = userList;

            // Get the non-admin users when controller loads
            UserService.getNonAdminUsers()
                .then (
                    function (userRes) {
                        // console.log('Non-admin user in User Controller: ', userRes, null, 2);
                        userList = userRes.data;
                        $scope.users = userList;
                    },
                    function (err) {
                        console.log('Error while getting users: ', err, null, 2);
                    });

            function getUserDetails () {
                var userDetails = {
                    email: $scope.user.email,
                    password: $scope.user.password
                };

                if ($scope.user.phone) {
                    userDetails.phone = $scope.user.phone;
                }

                if ($scope.user.first) {
                    userDetails.first = $scope.user.first;
                }

                if($scope.user.last) {
                    userDetails.last = $scope.user.last;
                }

                if($scope.user.admin) {
                    userDetails.isAdmin = $scope.user.admin;
                }

                return userDetails;
            }

            // Add a new user in the system
            $scope.addUser = function () {
                var userDetails = getUserDetails();

                UserService.addUser(userDetails)
                    .then(
                        function (userRes) {
                            var newUser = userRes.data;
                            userList.push(newUser);
                            $scope.users = userList;
                        },
                        function (err) {
                            console.log('Error while creating a user: ', err);
                        });
            };
        }
    ]);
// Setting up route
angular
    .module('user')
    .config(['$stateProvider',
        function($stateProvider) {
            // Booking state routing
            $stateProvider
                .state('user', {
                    url: '/users',
                    templateUrl: 'modules/member/views/user.client.view.html',
                    controller: 'UserController',
                    params: {
                        protected: true,
                        superUserOnly: true
                    }
                })
                .state('login', {
                    url: '/login',
                    templateUrl: 'modules/member/views/login.client.view.html',
                    controller: 'LoginController'
                });
        }
    ]);
'use strict';

// Authentication service for user variables
angular
	.module('user')
	.service('Authentication', [ '$scope', '$http',
		function ($scope, $http) {
			
		}
	]);
'use strict';

// Service that provides helper functions for User Controller
angular
    .module('user')
    .factory('UserService', ['$http', 
    	function ($http) {
    		// Provide service functions as closure
            return {
                login: login,
                logout: logout,
                getNonAdminUsers: getNonAdminUsers,
                addUser: addUser,
                isSuperUser: isSuperUser
            };

            function login (email, password) {
                var loginDetails = {
                    email: email,
                    password: password
                };

                return $http.post('/api/member/login', loginDetails);
            }

            function logout () {
                return $http.get('/api/member/logout');
            }

            function getNonAdminUsers () {
            	return $http.get('/api/member/non-admin');
            }

            function addUser (userDetails) {
                return $http.post('/api/member/signup', userDetails);
            }

            function isSuperUser (userTags) {
                var adminTag = _.find(userTags, function (tag) {
                    return tag === "admin";
                });
                
                if (!adminTag) {
                    return false;
                }

                return true;
            };
    	}
    ]);
// Setting up route
angular
    .module('space')
    .config(['$stateProvider',
        function($stateProvider) {
            // Booking state routing
            $stateProvider
                .state('space', {
                    url: '/space',
                    templateUrl: 'modules/space/views/space.client.view.html',
                    controller: 'SpaceController'
                });
        }
    ]);
'use strict';

angular
    .module('space')
    .controller('SpaceController', ['$rootScope', '$scope', '$state', '$http', '$stateParams', 'lodash', 'SpaceService', '$q',
        function ($rootScope, $scope, $state, $http, $stateParams, _, SpaceService, $q) {

            var spaceList = [];

            $scope.activeSpaces = [];
            $scope.room = {};

            function getAllActiveSpaces () {

                return SpaceService.getAllActiveSpaces()
                    .then (
                        function (activeSpaceRes) {
                            spaceList = activeSpaceRes.data;
                            
                            SpaceService.formatActiveSpaces(spaceList);
                            $scope.activeSpaces = spaceList;
                        },
                        function (err) {
                            console.log('Error while getting all spaces: ', err);
                        });
            }

            getAllActiveSpaces();
            
            // Find the space -- Deprecated
            $scope.findSpace = function () {
                var spaceDetails = {},
                    roomNumber = $scope.room.number,
                    capacity = $scope.room.capacity;

                if (room.number && room.number.length > 0) {
                    spaceDetails.room.number = roomNumber;
                }

                if (capacity) {
                    spaceDetails.capacity = capacity;
                }

                SpaceService.getSpace(spaceDetails)
                    .then(
                        function (spaces) {
                            console.log('Spaces: ', spaces, null, 2);
                            $scope.spaces = spaces;
                        },
                        function (err) {
                            console.log('Error while getting spaces');
                        });
            };

            function getSpaceDetails () {
                var spaceDetails = {
                    roomNumber: $scope.room.number
                };

                if ($scope.room.description) {
                    spaceDetails.description = $scope.room.description;
                }

                if ($scope.room.capacity) {
                    spaceDetails.capacity = $scope.room.capacity;
                }

                if ($scope.projector) {
                    spaceDetails.projector = $scope.room.projector;
                }

                if($scope.blueJeans) {
                    spaceDetails.blueJeans = $scope.room.blueJeans;
                }

                return spaceDetails;
            }

            // Add a new space
            $scope.addSpace = function () {
                var spaceDetails = getSpaceDetails();
                // console.log('Space Details in controller: ', spaceDetails);

                SpaceService.addSpace(spaceDetails)
                    .then (
                        function (spaceRes){
                            var space = spaceRes.data;
                            SpaceService.formatSpace(space);
                            spaceList.push(space);

                            $scope.activeSpaces = spaceList;
                        },
                        function (err) {
                            console.log('Error while adding space: ', err, null, 2);
                        });
            };

            // Delete a space
            $scope.deleteSpace = function (space) {
                console.log('Space to be deleted: ', space, null, 2);
                SpaceService.deleteSpace(space)
                    .then (
                        function (deletedSpaceRes) {
                            var deletedSpaceId = deletedSpaceRes.data._id,
                                splicedSpaceList = SpaceService.getSplicedSpaceList(spaceList, deletedSpaceId);

                            $scope.activeSpaces = splicedSpaceList;
                        },
                        function (err) {
                            console.log('Error while deleting space: ', err);
                        });
            };
            
        }
    ])
'use strict';

// Service that provides helper functions for Space Controller
angular
    .module('space')
    .factory('SpaceService', ['$http', '$q', 'lodash',
        function ($http, $q, _) {
            // Provide service functions as closure
            return {
                getSpace: getSpace,
                getAllActiveSpaces: getAllActiveSpaces,
                formatActiveSpaces: formatActiveSpaces,
                formatSpace: formatSpace,
                addSpace: addSpace,
                deleteSpace: deleteSpace,
                getSplicedSpaceList: getSplicedSpaceList
            };

            // Get space based on the space details
            function getSpace (spaceDetails) {
                return $http.get('/api/space', { params: spaceDetails });
            }

            // Get all active spaces
            function getAllActiveSpaces () {
                return $http.get('/api/space/all');
            }

            // Format all the active space details if not present
            function formatActiveSpaces (spaces) {
                _.forEach(spaces, function (space) {
                    if (!_.has(space, 'details.capacity')) {
                        _.set(space, 'details.capacity', 'NA');
                    }

                });
            }

            // Format a space
            function formatSpace (space) {
                if (!_.has(space, 'details.capacity')) {
                    _.set(space, 'details.capacity', 'NA');
                }   
            }

            // Add a new space
            function addSpace (spaceDetails) {
                return $http.post('/api/space', spaceDetails);
            }

            // Delete a space by Id
            function deleteSpace (space) {
                var spaceIdParams = { spaceId: space._id };
                return $http.delete('/api/space', { params: spaceIdParams });
            }

            // Remove a space from the space list and return the spliced list
            function getSplicedSpaceList (spaces, spaceId) {
                var removedSpace = _.remove(spaces, function (space) {
                    return space._id == spaceId;
                });

                return spaces;
            }
            
        }
    ]);