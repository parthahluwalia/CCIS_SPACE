'use strict';

/**
 * Load the middleware modules used by the app
 * @param app: Main Express application
 */
module.exports = function (app) {
    app.use(require('./booking/booking.module.js')());
};