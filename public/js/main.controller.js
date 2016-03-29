/**
 * Created by Rishi on 3/24/16.
 */
"use strict";
(function(){
    angular
        .module("CcisSpaceApp")
        .controller("MainController", MainController);


    function MainController($location, $scope) {
        console.log("Path: " + $location.path());
        $scope.$location = $location;
        var path = $location.path();
    }



})();
