'use strict';

// Service that provides helper functions for User Controller
angular
    .module('user')
    .factory('UserService', ['$http', 
    	function ($http) {
    		// Provide service functions as closure
            return {
                getNonAdminUsers: getNonAdminUsers
            };

            function getNonAdminUsers () {
            	return $http.get('/api/member/non-admin');
            }
    	}
    ]);