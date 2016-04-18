'use strict';

// Service that provides helper functions for User Controller
angular
    .module('user')
    .factory('UserService', ['$http', 
    	function ($http) {
    		// Provide service functions as closure
            return {
                login: login,
                logout: logout,
                getNonAdminUsers: getNonAdminUsers
            };

            function login (email, password) {
                var loginDetails = {
                    email: email,
                    password: password
                };

                return $http.post('/api/member/login', loginDetails);
            }

            function logout () {
                return $http.get('/api/member/logout');
            }

            function getNonAdminUsers () {
            	return $http.get('/api/member/non-admin');
            }
    	}
    ]);