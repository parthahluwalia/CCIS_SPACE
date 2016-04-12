'use strict';
// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('home');

// console.log("App Config: ", ApplicationConfiguration, null, 2);
'use strict';

//Setting up route
angular.module('home').config(['$stateProvider',
    function($stateProvider) {
        // Stores state routing
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'modules/home/views/home.client.view.html'
            });
    }
]);