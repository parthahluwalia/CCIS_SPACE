'use strict';

/**
 * Load the middleware modules used by the app
 * @param app: Main Express application
 */
module.exports = function (app, services) {
    app.use(require('./booking/booking.module.js')(services));
};