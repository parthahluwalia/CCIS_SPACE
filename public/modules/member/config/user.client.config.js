// Setting up route
angular
    .module('user')
    .config(['$stateProvider',
        function($stateProvider) {
            // Booking state routing
            $stateProvider
                .state('user', {
                    url: '/users',
                    templateUrl: 'modules/member/views/user.client.view.html',
                    controller: 'UserController',
                    params: {
                        protected: true,
                        superUserOnly: true
                    }
                })
                .state('login', {
                    url: '/login',
                    templateUrl: 'modules/member/views/login.client.view.html',
                    controller: 'LoginController'
                });
        }
    ]);