'use strict';

module.exports = function (moduleRoutes, memberService, passport) {

    var memberController = require('../controllers/member.controller.js')(memberService, passport);

    moduleRoutes.get('/', memberController.getMember);
    // moduleRoutes.post('/', memberController.createMember);
    moduleRoutes.put('/', memberController.updateMember);

    /*moduleRoutes.post('/signup', passport.authenticate ('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/booking/create', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));*/

    moduleRoutes.post('/login', passport.authenticate('local-login', { failureRedirect: '/api/member/loginFailiure', failureFlash : true }), memberController.memberLogin);
    moduleRoutes.get('/logout', memberController.memberLogout);

    moduleRoutes.post('/signup', memberController.createMember);
    moduleRoutes.get('/non-admin', memberController.getNonAdminUsers);

    // Falllback for failures
    moduleRoutes.all('/loginFailiure', function (req, res) {
        console.log('Login failiure');
        return res.status(401).send({ message: "The email / password you entered doesn't match any account. If you require access please contact the admin." });
    });
};