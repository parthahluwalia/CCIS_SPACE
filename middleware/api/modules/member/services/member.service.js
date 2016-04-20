'use strict';

var Promise = require('bluebird'),
    _ = require('lodash'),
    moment = require('moment');

module.exports = function (ccisroomDb, passport) {

    function MemberService() {
        this.MemberModel = require('../../../database/models/member.model.js')(ccisroomDb);
    }

    function getMemberCriteria (email, fname, lname, tags, phone ) {
        var memberCriteria = {};
        if (email) {
            memberCriteria.email = email;
        }
        if (fname) {
            memberCriteria["name.first"] = fname;
        }
        if(lname){
            memberCriteria["name.second"] = lname;
        }
        if(tags){
            memberCriteria.tags = tags;
        }
        if(phone){
            memberCriteria.phone=phone;
        }
        return memberCriteria;
    }

    /*MemberService.prototype.createMember=function(memberDetails){
        var email= _.has(memberDetails,'email')?memberDetails.email:null,
            fname= _.has(memberDetails,'fname')?memberDetails.fname:null,
            lname= _.has(memberDetails,'lname')?memberDetails.lname:null,
            tags= _.has(memberDetails,'tags')?memberDetails.tags:null,
            phone= _.has(memberDetails,'phone')?memberDetails.phone:null,
            password= _.has(memberDetails,'password')?memberDetails.password:null,
            memberRecord;

        memberRecord = new this.MemberModel();

        memberRecord.email=email;
        memberRecord.name ={
            first : fname,
            last: lname,
        };
        memberRecord.password=password;
        memberRecord.tags=tags;
        memberRecord.phone=phone;

        return memberRecord.save()
            .then(function(savedMember){
                return Promise.resolve(savedMember);
            })
            .catch(function (err){
               return Promise.reject(err);
            });

    };*/

    MemberService.prototype.getMember = function(memberDetails){
        var self = this,
            email= _.has(memberDetails, 'email')? memberDetails.email :null,
            fname = _.has(memberDetails, 'fname')?memberDetails.fname:null,
            lname = _.has(memberDetails, 'lname')?memberDetails.lname:null,
            phone = _.has(memberDetails, 'phone')?memberDetails.phone:null,
            tags= _.has(memberDetails,'tags')?memberDetails.tags:null;

        var memberCriteria = getMemberCriteria(email,fname, lname,tags,phone);

        return self.MemberModel
            .find(memberCriteria)
            .exec()
            .then(function (members) {
                return Promise.resolve(members);
            })
            .catch(function (err) {
                console.log('Error while getting members: ', err);
                return Promise.reject(err);
            });
    };

    /*
     * Finds and returns all the general (not admin) users of the system
     */
    MemberService.prototype.getNonAdminUsers = function () {
        var nonAdminUserCriteria = { "tags": { "$ne": "admin" } },
            nonAdminUsers = [];

        return this.MemberModel
            .find(nonAdminUserCriteria)
            .exec()
            .then(function (users) {
                
                _.forEach(users, function (user) {
                    nonAdminUsers.push({
                        email: user.email,
                        name: user.name,
                        tags: user.tags
                    });
                });

                return Promise.resolve(nonAdminUsers);
            })
            .catch(function (err) {
                console.log('Error while finding non-admin users: ', err, null, 2);
                return Promise.reject(err);
            });
    };


    MemberService.prototype.updateMember = function (memberDetails) {
        console.log('Member Details: ', memberDetails);

        memberDetails = typeof memberDetails === 'string' ? JSON.parse(memberDetails) : memberDetails;

        var self=this,
            email= _.has(memberDetails, 'email')? memberDetails.email :null;

        return this.MemberModel
            .findOne({email:email})
            .exec()
            .then(function (member){
                console.log('member is ', member);
                if(_.has(memberDetails,'fname')){
                    _.set(member, 'name.first', memberDetails.fname);
                }
                if(_.has(memberDetails,'lname')){
                    _.set(member, 'name.last', memberDetails.lname);
                }
                if(_.has(memberDetails,'phone')){
                    _.set(member,'phone',memberDetails.phone) ;
                }
                if(_.has(memberDetails,'tags')){
                    _.set(member,'tags',memberDetails.tags);
                }
                if(_.has(memberDetails,'email')){
                    _.set(member,'email',memberDetails.email);
                }

                return member.save()
                    .then(function (updatedMember) {
                        console.log('Member Updated in service: ', updatedMember, null, 2);
                        return Promise.resolve(updatedMember);
                    })
                    .catch(function (err) {
                        console.log('Error while saving updated space', err);
                        return Promise.reject(err);
                    });
            })
            .catch(function (err) {
                console.log('Error while updating member: ', err);
                return Promise.reject(err);
            });

    };

    function getNewMemberInstance (self, memberDetails) {
        var newMember = new self.MemberModel();
        newMember.email = memberDetails.email;
        newMember.password = newMember.generateHash(memberDetails.password);

        if (_.has(memberDetails, 'firstName')) {
            _.set(newMember, 'name.first', memberDetails.firstName);
        }

        if (_.has(memberDetails, 'lastName')) {
            _.set(newMember, 'name.last', memberDetails.lastName);
        }

        if (_.has(memberDetails, 'phone')) {
            newMember.phone = memberDetails.phone;
        }

        newMember.tags = ["user"];

        if(memberDetails.isAdmin && (memberDetails.isAdmin === "true" || memberDetails.isAdmin == true)) {
            newMember.tags.push("admin");
        }

        return newMember;
    }

    /**
     * Create a new member -- Bad Practice passing the req, res objects
     * Authenticates the user first
     */
    MemberService.prototype.createMember = function (memberDetails) {
        var email = memberDetails.email,
            self = this;

        return self.MemberModel
            .findOne({ email: email })
            .exec()
            .then(function (user) {
                if (user) {
                    console.log('User with the email already exists');
                    return Promise.resolve({ 
                        user: user, 
                        message: {
                            code: 200,
                            text: 'User with this email already exists'
                        }
                    });
                }

                var newUser = getNewMemberInstance(self, memberDetails);
                return newUser.save()
                    .then(function (user) {
                        return Promise.resolve(user);
                    })
                    .catch(function (err) {
                        console.log('Error while saving the new user: ', err, null, 2);
                        return Promise.reject(err);
                    });
            })
            .catch (function (err) {
                console.log('Error while creating a new member: ', err, null, 2);
                return Promise.reject(err);
            });


    };

    /**
     * Authenticate Member sign-up
     */
    MemberService.prototype.authenticateSignUp = function () {

    };

    return new MemberService();
};