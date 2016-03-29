/**
 * Created by Rishi on 3/24/16.
 */
"use strict";
(function () {
    angular
        .module("CcisSpaceApp")
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when("/home", {
                    templateUrl: "views/home/home.view.html"
                })
                .when("/booking",{
                    templateUrl: "views/booking/booking.view.html",
                    controller: "BookingController",
                    controllerAs:"model"
                })
                .when("/login",{
                    templateUrl: "views/user/login.view.html"
                })
                .when("/room",{
                    templateUrl: "views/room/room.view.html"
                })
                .when("/cancel-booking",{
                    templateUrl: "views/booking/cancel-booking.view.html",
                    controller: "CancelBookingController",
                    controllerAs:"model"
                })
                .otherwise({
                redirectTo: "/home"
            });
        }]);
})();
//# sourceMappingURL=config.js.map