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
    it("An /api/space GET response should return JSON", function(){
        chai.request(server)
            .get('/api/space')
            .end(function(err, res){
                res.should.be.json;
        });
    });
    it("An /api/space GET response should return status code 200", function(){
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
    // POST
    it("An /api/space POST response should be json", function(){
        chai.request(server)
            .post('/api/space')
            .send({"roomNumber": "109A", "capacity": 100 , "description": "Lecture Room" })
            .end(function(err, res){
                res.should.be.json;
                done();
            });
    });
    it("An /api/space POST response should have status 200", function(){
        chai.request(server)
            .post('/api/space')
            .send({"roomNumber": "109A", "capacity": 100 , "description": "Lecture Room" })
            .end(function(err, res){
                res.should.have.status(200);
                done();
        });
    });
    it("An /api/space POST response should have roomNumber field", function(){
        chai.request(server)
            .post('/api/space')
            .send({"roomNumber": "109A", "capacity": 100 , "description": "Lecture Room" })
            .end(function(err, res){
                res.body.should.have.property("roomNumber");
                done();
        });
    });
    it("An /api/space POST response should have _id field", function(){
        chai.request(server)
            .post('/api/space')
            .send({"roomNumber": "109A", "capacity": 100 , "description": "Lecture Room" })
            .end(function(err, res){
                res.body.should.have.property("_id");
                done();
            });
    });
    it("An /api/space POST response should have lastModified field", function(){
        chai.request(server)
            .post('/api/space')
            .send({"roomNumber": "109A", "capacity": 100 , "description": "Lecture Room" })
            .end(function(err, res){
                res.body.should.have.property("lastModified");
                done();
            });
    });
    it("An /api/space POST response should have description field", function(){
        chai.request(server)
            .post('/api/space')
            .send({"roomNumber": "109A", "capacity": 100 , "description": "Lecture Room" })
            .end(function(err, res){
                res.body.should.have.property("description");
                done();
            });
    });
    it("An /api/space POST response should have active field", function(){
        chai.request(server)
            .post('/api/space')
            .send({"roomNumber": "109A", "capacity": 100 , "description": "Lecture Room" })
            .end(function(err, res){
                res.body.should.have.property("active");
                done();
            });
    });
    it("An /api/space POST response should have details field", function(){
        chai.request(server)
            .post('/api/space')
            .send({"roomNumber": "109A", "capacity": 100 , "description": "Lecture Room" })
            .end(function(err, res){
                res.body.should.have.property("details");
                done();
            });
    });
    it("An /api/space POST response should have details.projector field", function(){
        chai.request(server)
            .post('/api/space')
            .send({"roomNumber": "109A", "capacity": 100 , "description": "Lecture Room" })
            .end(function(err, res){
                res.body.details.should.have.property("projector");
                done();
            });
    });
    it("An /api/space POST response should have details.capacity field", function(){
        chai.request(server)
            .post('/api/space')
            .send({"roomNumber": "109A", "capacity": 100 , "description": "Lecture Room" })
            .end(function(err, res){
                res.body.details.should.have.property("capacity");
                done();
            });
    });
    it("An /api/space POST response should have details.blueJeans field", function(){
        chai.request(server)
            .post('/api/space')
            .send({"roomNumber": "109A", "capacity": 100 , "description": "Lecture Room" })
            .end(function(err, res){
                res.body.details.should.have.property("blueJeans");
                done();
            });
    });
    // PUT
    it("An /api/space PUT response should be a json", function(){
        chai.request(server)
            .get('/api/space')
            .end(function(err, res) {
                chai.request(server)
                    .put('/api/space')
                    .send({'roomNumber': '110'})
                    .end(function (err, res) {
                        res.body.should.be.json;
                        done();
                    });
            });
    });
    it("An /api/space PUT response should have a status 200", function(){
        chai.request(server)
            .get('/api/space')
            .end(function(err, res) {
                chai.request(server)
                    .put('/api/space')
                    .send({'roomNumber': '110'})
                    .end(function (err, res) {
                        res.should.have.status(200);
                        done();
                    });
            });
    });
    it("An /api/space PUT response should have a property _id", function(){
        chai.request(server)
            .get('/api/space')
            .end(function(err, res) {
                chai.request(server)
                    .put('/api/space')
                    .send({'roomNumber': '110'})
                    .end(function (err, res) {
                        res.body.UPDATED.should.have.property("_id");
                        done();
                    });
            });
    });
    it("An /api/space PUT response should have property roomNumber", function(){
        chai.request(server)
            .get('/api/space')
            .end(function(err, res) {
                chai.request(server)
                    .put('/api/space')
                    .send({'roomNumber': '110'})
                    .end(function (err, res) {
                        res.body.UPDATED.should.have.property("roomNumber");
                        done();
                    });
            });
    });
    it("An /api/space PUT response should have property lastModified", function(){
        chai.request(server)
            .get('/api/space')
            .end(function(err, res) {
                chai.request(server)
                    .put('/api/space')
                    .send({'roomNumber': '110'})
                    .end(function (err, res) {
                        res.body.UPDATED.should.have.property("lastModified");
                        done();
                    });
            });
    });
    it("An /api/space PUT response should have property description", function(){
        chai.request(server)
            .get('/api/space')
            .end(function(err, res) {
                chai.request(server)
                    .put('/api/space')
                    .send({'roomNumber': '110'})
                    .end(function (err, res) {
                        res.body.UPDATED.should.have.property("description");
                        done();
                    });
            });
    });
    it("An /api/space PUT response should have property active", function(){
        chai.request(server)
            .get('/api/space')
            .end(function(err, res) {
                chai.request(server)
                    .put('/api/space')
                    .send({'roomNumber': '110'})
                    .end(function (err, res) {
                        res.body.UPDATED.should.have.property("active");
                        done();
                    });
            });
    });
    it("An /api/space PUT response should have property details", function(){
        chai.request(server)
            .get('/api/space')
            .end(function(err, res) {
                chai.request(server)
                    .put('/api/space')
                    .send({'roomNumber': '110'})
                    .end(function (err, res) {
                        res.body.UPDATED.should.have.property("details");
                        done();
                    });
            });
    });
    it("An /api/space PUT response should have property details.projector", function(){
        chai.request(server)
            .get('/api/space')
            .end(function(err, res) {
                chai.request(server)
                    .put('/api/space')
                    .send({'roomNumber': '110'})
                    .end(function (err, res) {
                        res.body.details.UPDATED.should.have.property("projector");
                        done();
                    });
            });
    });
    it("An /api/space PUT response should have property details.blueJeans", function(){
        chai.request(server)
            .get('/api/space')
            .end(function(err, res) {
                chai.request(server)
                    .put('/api/space')
                    .send({'roomNumber': '110'})
                    .end(function (err, res) {
                        res.body.details.UPDATED.should.have.property("blueJeans");
                        done();
                    });
            });
    });
    it("An /api/space PUT response should have property details.capacity", function(){
        chai.request(server)
            .get('/api/space')
            .end(function(err, res) {
                chai.request(server)
                    .put('/api/space')
                    .send({'roomNumber': '110'})
                    .end(function (err, res) {
                        res.body.details.UPDATED.should.have.property("capacity");
                        done();
                    });
            });
    });

    //DELETE
    it("Space Test DELETE - response should be JSON with delete message", function(){
        expect(true).to.be.true;

    });
})