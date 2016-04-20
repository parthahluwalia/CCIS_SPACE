'use strict';

angular
    .module('user')
    .controller('UserController', ['$scope', '$http', 'UserService',
        function ($scope, $http, UserService) {
            var userList = [];

            $scope.user = {};
            $scope.users = userList;

            // Get the non-admin users when controller loads
            UserService.getNonAdminUsers()
                .then (
                    function (userRes) {
                        // console.log('Non-admin user in User Controller: ', userRes, null, 2);
                        userList = userRes.data;
                        $scope.users = userList;
                    },
                    function (err) {
                        console.log('Error while getting users: ', err, null, 2);
                    });

            function getUserDetails () {
                var userDetails = {
                    email: $scope.user.email,
                    password: $scope.user.password
                };

                if ($scope.user.phone) {
                    userDetails.phone = $scope.user.phone;
                }

                if ($scope.user.first) {
                    userDetails.first = $scope.user.first;
                }

                if($scope.user.last) {
                    userDetails.last = $scope.user.last;
                }

                if($scope.user.admin) {
                    userDetails.isAdmin = $scope.user.admin;
                }

                return userDetails;
            }

            // Add a new user in the system
            $scope.addUser = function () {
                var userDetails = getUserDetails();

                UserService.addUser(userDetails)
                    .then(
                        function (userRes) {
                            var newUser = userRes.data;
                            userList.push(newUser);
                            $scope.users = userList;
                        },
                        function (err) {
                            console.log('Error while creating a user: ', err);
                        });
            };
        }
    ]);