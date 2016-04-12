'use strict';

// Init the application configuration module for AngularJS App
var ApplicationConfiguration = (function () {
    // Init module configuration options
    var appModuleName = 'ccisroomscheduler',
        appModuleVendorDependencies = ['ngResource', 'ngCookies', 'ngAnimate', 'ngTouch', 'ui.router'];

    // Add a new vertical module
    var registerModule = function (moduleName, dependencies) {
        // Create angular module
        angular
            .module(moduleName, dependencies || []);

        // Add the reqistered module to the list of vertical modules for the main app module
        angular
            .module(appModuleName)
            .requires
            .push(moduleName);
    };

    // Wrap required info in a closure
    return {
        appModuleName: appModuleName,
        appModuleVendorDependencies: appModuleVendorDependencies,
        registerModule: registerModule
    };

})();