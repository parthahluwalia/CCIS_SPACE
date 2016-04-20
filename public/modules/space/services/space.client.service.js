'use strict';

// Service that provides helper functions for Space Controller
angular
    .module('space')
    .factory('SpaceService', ['$http', '$q', 'lodash',
        function ($http, $q, _) {
            // Provide service functions as closure
            return {
                getSpace: getSpace,
                getAllActiveSpaces: getAllActiveSpaces,
                formatActiveSpaces: formatActiveSpaces,
                formatSpace: formatSpace,
                addSpace: addSpace,
                deleteSpace: deleteSpace,
                getSplicedSpaceList: getSplicedSpaceList
            };

            // Get space based on the space details
            function getSpace (spaceDetails) {
                return $http.get('/api/space', { params: spaceDetails });
            }

            // Get all active spaces
            function getAllActiveSpaces () {
                return $http.get('/api/space/all');
            }

            // Format all the active space details if not present
            function formatActiveSpaces (spaces) {
                _.forEach(spaces, function (space) {
                    if (!_.has(space, 'details.capacity')) {
                        _.set(space, 'details.capacity', 'NA');
                    }

                });
            }

            // Format a space
            function formatSpace (space) {
                if (!_.has(space, 'details.capacity')) {
                    _.set(space, 'details.capacity', 'NA');
                }   
            }

            // Add a new space
            function addSpace (spaceDetails) {
                return $http.post('/api/space', spaceDetails);
            }

            // Delete a space by Id
            function deleteSpace (space) {
                var spaceIdParams = { spaceId: space._id };
                return $http.delete('/api/space', { params: spaceIdParams });
            }

            // Remove a space from the space list and return the spliced list
            function getSplicedSpaceList (spaces, spaceId) {
                var removedSpace = _.remove(spaces, function (space) {
                    return space._id == spaceId;
                });

                return spaces;
            }
            
        }
    ]);