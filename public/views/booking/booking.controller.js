/**
 * Created by Rishi on 3/26/16.
 */
"use strict";
(function(){
    angular
        .module("CcisSpaceApp")
        .controller("BookingController", BookingController);


    function BookingController($location, $scope) {
        console.log("Hello From Booking Controller");
        console.log("Path: " + $location.path());
        $scope.$location = $location;
        //var path = $location.path();
    }



})();