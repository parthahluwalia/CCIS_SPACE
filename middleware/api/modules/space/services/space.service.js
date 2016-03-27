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
                return Promise.resolve(spaces);
            })
            .catch(function (err) {
                console.log('Error while getting spaces: ', err);
                return Promise.reject(err);
            });
    };


    SpaceService.prototype.createSpace = function(spaceDetails){
        var roomNumber=_.has(spaceDetails, 'roomNumber')? spaceDetails.roomNumber :null,
            description= _.has(spaceDetails, 'description')?spaceDetails.description :null,
            capacity = _.has(spaceDetails, 'capacity')?spaceDetails.capacity:null,
            blueJeans = _.has(spaceDetails, 'blueJeans')?spaceDetails.blueJeans:null,
            projector = _.has(spaceDetails, 'projector')?spaceDetails.projector:null,
        spaceRecord;

        spaceRecord = new this.RoomModel();
        spaceRecord.roomNumber=roomNumber;
        spaceRecord.details = {
            projector: projector,
            capacity: capacity,
            blueJeans: blueJeans
        };
        spaceRecord.description=description;

        return spaceRecord.save()
            .then(function (spaceCreated) {
                return Promise.resolve(spaceCreated);
            })
            .catch(function (err) {
                console.log('Error while creating spaces: ', err);
                return Promise.reject(err);
            });
    };

    return new SpaceService();

};
