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