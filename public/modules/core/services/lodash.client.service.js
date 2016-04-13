'use strict';

// Factory Service to use Lodash in the browser
angular
    .module('core')
    .factory('lodash', ['$window',
        function ($window) {
            return $window._;
        }
    ]);