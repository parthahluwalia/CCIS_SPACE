/**
 * Created by Neha on 4/6/2016.
 */

'use strict';

module.exports = function (moduleRoutes, bookingService) {

    var memberController = require('../controllers/member.controller.js')(memberService);

    moduleRoutes.get('/', memberController.getMember);
    moduleRoutes.post('/', memberController.createMember);
};