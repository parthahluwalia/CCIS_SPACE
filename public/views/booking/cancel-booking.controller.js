/**
 * Created by Rishi on 3/26/16.
 */
"use strict";
(function(){
    angular
        .module("CcisSpaceApp")
        .controller("CancelBookingController", CancelBookingController);


    function CancelBookingController($location, $scope) {
        console.log("Hello From Cancel booking Controller");
        console.log("Path: " + $location.path());
        $scope.$location = $location;
        //var path = $location.path();
    }



})();