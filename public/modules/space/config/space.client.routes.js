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