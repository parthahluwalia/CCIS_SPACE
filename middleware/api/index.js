'use strict';

/**
 * Load the middleware modules used by the app
 * @param app: Main Express application
 */
module.exports = function (app, services, config) {
	app.use(require('./modules/booking/booking.module.js')(services, config));
    app.use(require('./modules/space/space.module.js')(services, config));
    app.use(require('./modules/member/member.module.js')(services, config));
};