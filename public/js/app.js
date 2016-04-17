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
ApplicationConfiguration.registerModule('space');
'use strict';

// Setting up route
angular
    .module('booking', ['ngFlash'])
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
                .state('booking.cancel', {
                    url: '/cancel',
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
    .controller('BookingController', ['$rootScope', '$scope', '$state', '$http', '$stateParams', '$filter', 'BookingService', '$location', 'Flash',
        function ($rootScope, $scope, $state, $http, $stateParams, $filter, BookingService, $location, Flash) {

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
                var message = '<strong>Booking Details Missing! </strong> Enter Required Fields: ',
                    detailsMissing = false;

                if (!bookingDetails.startTime || !bookingDetails.endTime) {
                    detailsMissing = true;
                    message += 'Start Time, End Time';
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
        }
    ]);
'use strict';

angular
    .module('core')
    .controller('MainController', ['$scope', '$rootScope', '$controller', '$location', '$window', '$anchorScroll', '$state', 
        function ($scope, $rootScope, $controller, $location, $window, $anchorScroll, $state) {

            // console.log('In Main controller');

            /**
             * Go to url-hash
             * @param hash
             * @todo Move this to a proper controller scope
             */
            $rootScope.goHash = function (hash) {
                $location.hash(hash);
                $anchorScroll();
            };

            // Collapsing the menu after navigation -- $scope.on is NOT a function error??? --> WTF!
            /*$scope.on('$stateChangeSuccess', function (e, toState) {
                //For anonymousOnly routes, redirect to home page (for now) 
                // if ($state.params.anonymousOnly && ($scope.user || $scope.identity)) {
                if ($state.params.anonymousOnly) {
                    $location.path('home');
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
            
            // Find the space
            $scope.findSpace = function () {
                var spaceDetails = {},
                    roomNumber = $scope.roomNumber,
                    capacity = $scope.capacity;

                if (roomNumber && roomNumber.length > 0) {
                    spaceDetails.roomNumber = roomNumber;
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
            
        }
    ])
'use strict';

// Service that provides helper functions for Space Controller
angular
    .module('space')
    .factory('SpaceService', ['$http', '$q',
        function ($http, $q) {
            // Provide service functions as closure
            return {
                getSpace: getSpace
            };

            // Get space based on the space details
            function getSpace (spaceDetails) {
                return $http.get('/api/space', { params: spaceDetails });
            }

            
        }
    ]);