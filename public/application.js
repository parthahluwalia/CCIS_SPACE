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