/**
 * Created by Neha on 4/6/2016.
 */

'use strict';

var Promise = require('bluebird');

module.exports = function (bookingService) {
    // Booking Controller Constructor
    function MemberController () {

    }

    // function

    MemberController.prototype.getMember = function(req, res, next) {
        // console.log('In Booking controller');
        var memberCrtiteria = req.query;
        var members = memberService.getMember(memberCrtiteria);
        res.status(200).send(members);
    };

    MemberController.prototype.createMember = function (req, res, next) {
        var memberDetails = req.body;
        var member = memberService.createMember(memberDetails)
            .then(function (members) {
                console.log('Members in member controller');
                console.log(members, null, 2);
                return members;
            })
            .catch(function (error) {
                // Should trigger error here...
                return error;
            });

        res.status(200).send(member);
    };

    return new MemberController();
};