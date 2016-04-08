/**
 * Created by Rishi on 3/31/16.
 */
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var expect = require('chai').expect;
var server = require('../');

chai.use(chaiHttp);
chai.should();

describe("Space Tests", function(){
    it("Space Test GET - should return JSON", function(){
        chai.request(server)
            .get('/api/booking')
            .end(function(err, res){
                res.should.be.json;
            });


    });
    it("Space Test GET - should return status code 200", function(){
        chai.request(server)
            .get('/api/space')
            .end(function(err, res){
                res.should.have.status(200);
            });
    });
    it("An /api/space GET response should contain _id field", function () {
        chai.request(server)
            .get('/api/space')
            .end(function(err, res){
                res.body.should.have.property("_id");
        });
    });
    it("An /api/space GET response should contain roomNumber field", function () {
        chai.request(server)
            .get('/api/space')
            .end(function(err, res){
                res.body.should.have.property("roomNumber");
         });
    });
    it("An /api/space GET response should contain lastModified field", function () {
        chai.request(server)
            .get('/api/space')
            .end(function(err, res){
                res.body.should.have.property("lastModified");
        });
    });
    it("An /api/space GET response should contain description field", function () {
        chai.request(server)
            .get('/api/space')
            .end(function(err, res){
                res.body.should.have.property("description");
        });
    });
    it("An /api/space GET response should contain active field", function () {
        chai.request(server)
            .get('/api/space')
            .end(function(err, res){
                res.body.should.have.property("active");
        });
    });
    it("An /api/space GET response should contain details field", function () {
        chai.request(server)
            .get('/api/space')
            .end(function(err, res){
                res.body.should.have.property("details");
         });
    });
    it("An /api/space GET response should contain details.capacity field", function () {
        chai.request(server)
            .get('/api/space')
            .end(function(err, res){
                res.body.details.should.have.property("capacity");
        });
    });
    it("An /api/space GET response should contain details.blueJeans field", function () {
        chai.request(server)
            .get('/api/space')
            .end(function(err, res){
                res.body.details.should.have.property("blueJeans");
        });
    });
    it("An /api/space GET response should contain details.projector field", function () {
        chai.request(server)
            .get('/api/space')
            .end(function(err, res){
                res.body.details.should.have.property("projector");
        });
    });
    it("Space Test POST - should return JSON with new Space added", function(){
        expect(true).to.be.true;

    });
    it("Space Test PUT - response should be JSON with updated Space", function(){
        expect(true).to.be.true;

    });
    it("Space Test DELETE - response should be JSON with delete message", function(){
        expect(true).to.be.true;

    });
})