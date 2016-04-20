'use strict';

angular
    .module('core')
    .controller('MainController', ['$scope', '$rootScope', '$controller', '$location', '$window', '$anchorScroll', '$state', 'lodash', 'UserService',
        function ($scope, $rootScope, $controller, $location, $window, $anchorScroll, $state, _, UserService) {

            // Check if a user is an admin
            $scope.isAdmin = function (user) {
                // console.log('RootScope User: ', $rootScope.user, null, 2);
                var adminTag = _.find(user.tags, function (tag) {
                    return tag === "admin";
                });
                
                if (!adminTag) {
                    return false;
                }

                return true;
            };

            // Log a user out
            $scope.logout = function () {
                UserService.logout()
                    .then (
                        function (logoutRes) {
                            console.log('Logout successful: ', logoutRes, null, 2);
                            $rootScope.user = null;
                            // Redirect to 'home' state
                            $state.go('home');
                        },
                        function (err) {
                            console.log('Error while log out: ', err, null, 2);
                        });
            };

            // Redirect to login page
            $scope.loginRedirect = function () {
                console.log('Redirecting to login state');
                $state.go('login');
            };

            /**
             * Go to url-hash
             * @param hash
             * @todo Move this to a proper controller scope
             */
            $rootScope.goHash = function (hash) {
                $location.hash(hash);
                $anchorScroll();
            };

            // Collapsing the menu after navigation -- Not working!! Might want to do a $broadcast
            // Handled at the rootScope for now in core.client.run!
            /*$scope.on('$stateChangeSuccess', function (e, toState) {
                //For protected routes, redirect the user to the login page
                if ($state.params.protected && !$rootScope.user) {
                    $scope.loginRedirect();
                }
            });*/

        }
    ]);