/**
 * Created by Neha on 3/25/2016.
 */
'use strict';

module.exports = function (moduleRoutes, spaceService, memberService) {

    var spaceController = require('../controllers/space.controller.js')(spaceService),
    	memberController = require('../../member/controllers/member.controller.js')(memberService);

    moduleRoutes.get('/', memberController.isAuthenticated, spaceController.getSpace);
    moduleRoutes.post('/', memberController.isAuthenticated, spaceController.createSpace);
    moduleRoutes.put('/', memberController.isAuthenticated, spaceController.updateSpace);
    moduleRoutes.get('/all', spaceController.getAllActiveSpaces);
    moduleRoutes.delete('/', memberController.isAuthenticated, spaceController.deleteSpaceById)
};