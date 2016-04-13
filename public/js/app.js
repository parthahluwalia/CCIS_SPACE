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
    .module('booking')
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
    .controller('BookingController', ['$rootScope', '$scope', '$state', '$http', '$stateParams', 
        function ($rootScope, $scope, $state, $http, $stateParams) {
            
            $scope.isCreateBookingState = function () {
                return $state.current.name === 'booking.create';
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