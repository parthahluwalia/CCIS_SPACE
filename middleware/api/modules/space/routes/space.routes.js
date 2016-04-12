/**
 * Created by Neha on 3/25/2016.
 */
'use strict';

module.exports = function (moduleRoutes, spaceService) {

    var spaceController = require('../controllers/space.controller.js')(spaceService);

    moduleRoutes.get('/', spaceController.getSpace);
    moduleRoutes.post('/', spaceController.createSpace);
    moduleRoutes.put('/', spaceController.updateSpace);
};