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