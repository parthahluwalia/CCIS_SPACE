/**
 * Created by Neha on 3/25/2016.
 */
'use strict';

var Promise = require('bluebird'),
    _ = require('lodash'),
    moment = require('moment');

//START
module.exports = function (ccisroomDb) {

    function SpaceService () {
        this.RoomModel = require('../../../database/models/room.model.js')(ccisroomDb);
    }

    function getSpaceCriteria (roomNumber, capacity, blueJeans, projector ) {
        var spaceCriteria = {};
        if (roomNumber) {
            spaceCriteria.roomNumber = roomNumber;
        }
        if (capacity) {
            spaceCriteria["details.capacity"] = capacity;
        }
        if(blueJeans){
            spaceCriteria["details.blueJeans"] = blueJeans;
        }
        if(projector){
            spaceCriteria["details.projector"] = projector;
        }
        return spaceCriteria;
    }


    /**
     *
     * @param spaceDetails
     * @returns matching records for spaces from DB
     */
    SpaceService.prototype.getSpace = function(spaceDetails){
        var self = this,
            roomNumber= _.has(spaceDetails, 'roomNumber')? spaceDetails.roomNumber :null,
            capacity = _.has(spaceDetails, 'capacity')?spaceDetails.capacity:null,
            blueJeans = _.has(spaceDetails, 'blueJeans')?spaceDetails.blueJeans:null,
            projector = _.has(spaceDetails, 'projector')?spaceDetails.projector:null;

        var spaceCriteria = getSpaceCriteria(roomNumber,capacity, blueJeans, projector);

        return self.RoomModel
            .find(spaceCriteria)
            .exec()
            .then(function (spaces) {
                console.log('Spaces: ', spaces);
                return Promise.resolve(spaces);
            })
            .catch(function (err) {
                console.log('Error while getting spaces: ', err);
                return Promise.reject(err);
            });
    };

    SpaceService.prototype.getSpaceById = function (spaceId) {
        return this.RoomModel
            .findOne({ _id: spaceId })
            .exec()
            .then(function (space) {
                return Promise.resolve({
                    roomNumber: space.roomNumber,
                    details: space.details
                });
            })
            .catch (function (err) {
                console.log('Error while getting space by Id: ', err, null, 2);
                return Promise.reject(err);
            });
    };

    SpaceService.prototype.createSpace = function(spaceDetails) {
        var spaceRecord;

        if (!_.has(spaceDetails, 'roomNumber')) {
            return Promise.reject('You must specify a room number');
        }

        spaceRecord = new this.RoomModel();
        spaceRecord.roomNumber = spaceDetails.roomNumber;

        if (_.has(spaceDetails, 'description')) {
            spaceRecord.description = spaceDetails.description;
        }

        if (_.has(spaceDetails, 'capacity')) {
            _.set(spaceRecord, 'details.capacity', spaceDetails.capacity);
        }

        if (_.has(spaceDetails, 'blueJeans')) {
            _.set(spaceRecord, 'details.blueJeans', spaceDetails.blueJeans);
        }

        if (_.has(spaceDetails, 'projector')) {
            _.set(spaceRecord, 'details.projector', spaceDetails.projector);
        }

        return spaceRecord.save()
            .then(function (spaceCreated) {
                return Promise.resolve(spaceCreated);
            })
            .catch(function (err) {
                console.log('Error while creating spaces: ', err);
                return Promise.reject(err);
            });

    };

    SpaceService.prototype.updateSpace = function (spaceDetails) {
        console.log('Space Details: ', spaceDetails);

        spaceDetails = typeof spaceDetails === 'string' ? JSON.parse(spaceDetails) : spaceDetails;

        var self=this,
            roomNumber=_.has(spaceDetails, 'roomNumber')? spaceDetails.roomNumber :null;
        return this.RoomModel
           .findOne({ roomNumber: roomNumber })
            .exec()
            .then(function (space){
                var tempDetails = {"projector" : false, "capacity": 0, "blueJeans" : false};
               if(_.has(spaceDetails,'description')){
                   _.set(space, 'description', spaceDetails.description);
               }
               if(_.has(spaceDetails,'capacity')){
                   _.set(space, 'details.capacity', spaceDetails.capacity);
               }
               if(_.has(spaceDetails,'projector')){
                   _.set(space,'details.projector',spaceDetails.projector) ;
               }
              if(_.has(spaceDetails,'blueJeans')){
                  _.set(space,'details.blueJeans',spaceDetails.blueJeans);
              }

              return space.save()
                    .then(function (updatedSpace) {
                        console.log('Space Updated: ', updatedSpace, null, 2);
                        return Promise.resolve(updatedSpace);
                    })
                    .catch(function (err) {
                        console.log('Error while saving updated space', err);
                        return Promise.reject(err);
                    });
            })

    };

    SpaceService.prototype.saveSpaceUp = function (space) {
        console.log("In Save Space UP ::: " + space);
        return space.save()
            .then(function (space) {
                console.log('record updated: ', space, null, 2);
                return Promise.resolve(space);
            })
            .catch(function (err) {
                console.log('Error while getting spaces: ', err);
                return Promise.reject(err);
            });
    };

    /*
     * Get all spaces
     * returns: [spaces]
     */
    SpaceService.prototype.getAllActiveSpaces = function () {
        return this.RoomModel
            .find({ active: true })
            .exec()
            .then(function (spaces) {
                return Promise.resolve(spaces);
            })
            .catch(function (err) {
                console.log('Error while getting all spaces: ', err, null, 2);
                return Promise.reject(err);
            })
    };

    return new SpaceService();
};
