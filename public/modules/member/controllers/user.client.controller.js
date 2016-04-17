'use strict';

angular
    .module('user')
    .controller('UserController', ['$scope', '$http', 'UserService',
    	function ($scope, $http, UserService) {
    		// Get the non-admin users when controller loads
    		UserService.getNonAdminUsers()
    			.then (
    				function (userRes) {
    					// console.log('Non-admin user in User Controller: ', userRes, null, 2);
    					$scope.nonAdminUsers = userRes.data;
    				},
    				function (err) {
    					console.log('Error while getting users: ', err, null, 2);
    				});
    	}
    ]);