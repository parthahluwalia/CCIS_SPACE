'use strict';

/**
 * Load the middleware modules used by the app
 * @param app: Main Express application
 */
module.exports = function (app, services, config) {
<<<<<<< HEAD
	app.use(require('./modules/booking/booking.module.js')(services, config));
    app.use(require('./modules/space/space.module.js')(services, config));
=======
    // app.use(require('./modules/booking/booking.module.js')(services, config));
     //app.use(require('./modules/space/space.module.js')(services, config));
    app.use(require('./modules/member/member.module.js')(services, config));
>>>>>>> 5c8b3afc160f62e4c24d57fbc0ef782af0157edf
};