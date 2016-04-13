'use strict';

// Service that provides helper functions for Space Controller
angular
    .module('space')
    .factory('SpaceService', ['$http', '$q',
        function ($http, $q) {
            // Provide service functions as closure
            return {
                getSpace: getSpace
            };

            // Get space based on the space details
            function getSpace (spaceDetails) {
                return $http.get('/api/space', { params: spaceDetails });
            }

            
        }
    ]);