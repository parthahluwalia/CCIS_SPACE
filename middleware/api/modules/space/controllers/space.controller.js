/**
 * Created by Neha on 3/25/2016.
 */
'use strict';

var Promise = require('bluebird');

module.exports = function (spaceService) {
    // Booking Controller Constructor
    function SpaceController () {

    }

   SpaceController.prototype.getSpace = function(req, res, next) {
        // console.log('In Space controller');
        var spaceCriteria = req.query;
        spaceService.getSpace(spaceCriteria)
            .then(function (spaces) {
                return res.status(200).send(spaces);
            })
            .catch(function (err) {
                console.log('Error while geting spaces: ', err);
                return res.status(400).send(err);
            });
    };

    SpaceController.prototype.createSpace = function(req,res,next) {
        var spaceDetails = req.body;
        console.log('Creating spaces');
        return spaceService.createSpace(spaceDetails)
            .then(function (space){
                return res.status(200).send(space);
            })
            .catch(function (error) {
                // Should trigger error here...
                console.log('Got error: ', error, null, 2);
                return res.status(400).send(error);
            });

    };
    return new SpaceController();
};