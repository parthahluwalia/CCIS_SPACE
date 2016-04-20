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