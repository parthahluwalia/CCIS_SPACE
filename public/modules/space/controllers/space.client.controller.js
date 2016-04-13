'use strict';

angular
    .module('space')
    .controller('SpaceController', ['$rootScope', '$scope', '$state', '$http', '$stateParams', 'lodash', 'SpaceService', '$q',
        function ($rootScope, $scope, $state, $http, $stateParams, _, SpaceService, $q) {
            
            // Find the space
            $scope.findSpace = function () {
                var spaceDetails = {},
                    roomNumber = $scope.roomNumber,
                    capacity = $scope.capacity;

                if (roomNumber && roomNumber.length > 0) {
                    spaceDetails.roomNumber = roomNumber;
                }

                if (capacity) {
                    spaceDetails.capacity = capacity;
                }

                SpaceService.getSpace(spaceDetails)
                    .then(
                        function (spaces) {
                            console.log('Spaces: ', spaces, null, 2);
                            $scope.spaces = spaces;
                        },
                        function (err) {
                            console.log('Error while getting spaces');
                        });
            };
            
        }
    ])