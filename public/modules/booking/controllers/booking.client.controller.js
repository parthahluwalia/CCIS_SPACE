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
    ])
