/**
 * Created by Neha on 4/6/2016.
 */
'use strict';

var Promise = require('bluebird'),
    _ = require('lodash'),
    moment = require('moment');

//START
module.exports = function (ccisroomDb) {
    function SpaceService() {
        this.MemberModel = require('../../../database/models/member.model.js')(ccisroomDb);
    }

    function getMemberCriteria (email, fname, lname, tags, phoneNumber ) {
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
        if(phoneNumber){
            memberCriteria.phone=phoneNumber;
        }
        return memberCriteria;
    }

    MemberService.prototype.createMember=function(memberDetails){
        var email= _.has(memberDetails,'email')?memberDetails.email:null,
            fname= _.has(memberDetails,'fname')?memberDetails.fname:null,
            lname= _.has(memberDetails,'lname')?memberDetails.lname:null,
            tags= _.has(memberDetails,'tags')?memberDetails.tags:null,
            phoneNumber= _.has(memberDetails,'phoneNumber')?memberDetails.phoneNumber:null,
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
        memberRecord.phone=phoneNumber;

        return memberRecord.save()
            .then(function(savedMember){
                return Promise.resolve(savedMember);
            })
            .catch(function (err){
               return Promise.reject(err);
            });

    };
 return new MemberService();
};