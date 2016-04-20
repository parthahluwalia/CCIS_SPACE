'use strict';

angular
    .module('space')
    .controller('SpaceController', ['$rootScope', '$scope', '$state', '$http', '$stateParams', 'lodash', 'SpaceService', '$q',
        function ($rootScope, $scope, $state, $http, $stateParams, _, SpaceService, $q) {

            var spaceList = [];

            $scope.activeSpaces = [];

            function getAllActiveSpaces () {

                return SpaceService.getAllActiveSpaces()
                    .then (
                        function (activeSpaceRes) {
                            spaceList = activeSpaceRes.data;
                            
                            SpaceService.formatActiveSpaces(spaceList);
                            $scope.activeSpaces = spaceList;
                        },
                        function (err) {
                            console.log('Error while getting all spaces: ', err);
                        });
            }

            getAllActiveSpaces();
            
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

            function getSpaceDetails () {
                var spaceDetails = {
                    roomNumber: $scope.roomNumber
                };

                if ($scope.roomDescription) {
                    spaceDetails.description = $scope.roomDescription;
                }

                if ($scope.roomCapacity) {
                    spaceDetails.capacity = $scope.roomCapacity;
                }

                if ($scope.projector) {
                    spaceDetails.projector = $scope.projector;
                }

                if($scope.blueJeans) {
                    spaceDetails.blueJeans = $scope.blueJeans;
                }

                return spaceDetails;
            }

            // Add a new space
            $scope.addSpace = function () {
                var spaceDetails = getSpaceDetails();

                SpaceService.addSpace(spaceDetails)
                    .then (
                        function (spaceRes){
                            var space = spaceRes.data;
                            SpaceService.formatSpace(space);
                            spaceList.push(space);

                            $scope.activeSpaces = spaceList;
                        },
                        function (err) {
                            console.log('Error while adding space: ', err, null, 2);
                        });
            };

            // Delete a space
            $scope.deleteSpace = function (space) {
                console.log('Space to be deleted: ', space, null, 2);
                SpaceService.deleteSpace(space)
                    .then (
                        function (deletedSpaceRes) {
                            var deletedSpaceId = deletedSpaceRes.data._id,
                                splicedSpaceList = SpaceService.getSplicedSpaceList(spaceList, deletedSpaceId);

                            $scope.activeSpaces = splicedSpaceList;
                        },
                        function (err) {
                            console.log('Error while deleting space: ', err);
                        });
            };
            
        }
    ])