'use strict';

angular
    .module('user')
    .controller('LoginController', ['$scope', '$http', 'UserService', '$rootScope', 'Flash', '$state',
    	function ($scope, $http, UserService, $rootScope, Flash, $state) {

    		// Function to log a user in
    		// If credentials legit, redirect to state 'booking'
    		// Display a flash message otherwise
    		$scope.login = function () {
    			UserService.login($scope.userEmail, $scope.userPassword)
    				.then (
    					function (userRes) {
    						console.log('Logged in: ', userRes, null, 2);
    						// Populate the user in the rootScope --> Bad practice, I know, but we gotta speed up!
    						$rootScope.user = userRes.data;

    						// Redirect to booking state
    						$state.go('booking');
    					},
    					function (err) {
    						// console.log('Errored user: ', err, null, 2);
    						var message = "<strong>" + err.statusText + "! </strong>";

    						if (err.status === 401) {
    							message += err.data.message;
    						}

    						Flash.create('danger', message);
    					});
    		};

    	}
    ]);