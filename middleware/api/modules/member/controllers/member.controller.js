/**
 * Created by Neha on 4/6/2016.
 */

'use strict';

var Promise = require('bluebird');

module.exports = function (memberService) {
    // Booking Controller Constructor
    function MemberController () {
    }

    MemberController.prototype.getMember = function(req, res, next) {
        console.log('In Member controller');
        var memberCriteria = req.query;
        memberService.getMember(spaceCriteria)
            .then(function (members) {
                return res.status(200).send(members);
            })
            .catch(function (err) {
                console.log('Error while geting spaces: ', err);
                return res.status(400).send(err);
            });
    };

    MemberController.prototype.createMember = function(req,res,next) {
        var memberDetails = req.body;
        console.log('Creating members');
        return memberService.createMember(memberDetails)
            .then(function (member){
                return res.status(200).send(member);
            })
            .catch(function (error) {
                // Should trigger error here...
                console.log('Got error: ', error, null, 2);
                return res.status(400).send(error);
            });

    };

    return new MemberController();
};