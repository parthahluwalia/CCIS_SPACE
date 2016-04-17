'use strict';

module.exports = function (moduleRoutes, memberService, passport) {

    var memberController = require('../controllers/member.controller.js')(memberService);

    moduleRoutes.get('/', memberController.getMember);
    moduleRoutes.post('/', memberController.createMember);
    moduleRoutes.put('/', memberController.updateMember);

    moduleRoutes.get('/foo', function (req, res) {
    	console.log('Hit foo');
    	res.status(200).send('Hit Member Foo');
    });

    moduleRoutes.post('/signup', passport.authenticate ('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/booking/create', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
};