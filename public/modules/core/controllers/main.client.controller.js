'use strict';

angular
    .module('core')
    .controller('MainController', ['$scope', '$rootScope', '$controller', '$location', '$window', '$anchorScroll', '$state', 'lodash',
        function ($scope, $rootScope, $controller, $location, $window, $anchorScroll, $state, _) {

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

            /**
             * Go to url-hash
             * @param hash
             * @todo Move this to a proper controller scope
             */
            $rootScope.goHash = function (hash) {
                $location.hash(hash);
                $anchorScroll();
            };

            // Collapsing the menu after navigation -- $scope.on is NOT a function error??? --> WTF!
            /*$scope.on('$stateChangeSuccess', function (e, toState) {
                //For anonymousOnly routes, redirect to home page (for now) 
                // if ($state.params.anonymousOnly && ($scope.user || $scope.identity)) {
                if ($state.params.anonymousOnly) {
                    $location.path('home');
                }
            });*/

        }
    ]);