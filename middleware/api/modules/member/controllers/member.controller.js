/**
 * Created by Neha on 4/6/2016.
 */

'use strict';

var Promise = require('bluebird'),
    _ = require('lodash');

module.exports = function (memberService, passport) {

    function MemberController () {

    }

    /**
     * After a user is authenticated, set the user details to be sent as a response to the frontend
     */
    MemberController.prototype.memberLogin = function (req, res, next) {
        var reqUser = req.user,
            userDetails = {
                email: reqUser.email,
                name: reqUser.name,
                tags: reqUser.tags
            };

        console.log('Logged a user in, Id: ', reqUser._id, null, 2);

        res.locals.memberId = reqUser._id;

        return res.status(200).send(userDetails);
    };

    MemberController.prototype.getMember = function(req, res, next) {
        
        var memberCriteria = req.query;
        memberService.getMember(memberCriteria)
            .then(function (members) {
                return res.status(200).send(members);
            })
            .catch(function (err) {
                console.log('Error while geting member: ', err);
                return res.status(400).send(err);
            });
    };

    /**
     * Creates a new member
     */
    MemberController.prototype.createMember = function (req, res, next) {
        var memberDetails = req.body;
        console.log('Creating member with details: ', memberDetails, null, 2);

        if (!_.has(memberDetails, 'email') || !_.has(memberDetails, 'password')) {
            return res.status(400).send({ message: 'Email / Password must be specified' });
        }

        return memberService.createMember(memberDetails)
            .then(function (user) {
                console.log('new user in controller: ', user, null, 2);
                return res.status(200).send(user);
            })
            .catch(function (err) {
                return res.status(400).send(err);
            });
    };

    /*
     * Finds and returns all the general (not admin) users of the system
     */
    MemberController.prototype.getNonAdminUsers = function (req, res, next) {
        return memberService.getNonAdminUsers()
            .then (function (users) {
                console.log('Non Admin users in Member Controller: ', users, null, 2);
                return res.status(200).send(users);
            })
            .catch(function (err) {
                return res.status(400).send(err);
            });
    };


    MemberController.prototype.updateMember = function(req,res,next){
        var memberDetails = req.body;
        console.log('Updating member in ctrl...');
        return memberService
            .updateMember(memberDetails)
            .then(function (members){
                console.log('member updated in ctrl: ', members, null ,2);
                return res.status(200).send(members);

            })
            .catch(function (error){
                console.log('Error in Update member ctrl: ', error, null, 2);
                return res.status(400).send(error);
            });
    };

    return new MemberController();
};