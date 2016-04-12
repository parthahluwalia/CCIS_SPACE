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