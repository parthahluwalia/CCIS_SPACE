/**
 * Created by Rishi on 3/13/16.
 */
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var expect = require('chai').expect;
var server = require('../');

chai.use(chaiHttp);
chai.should();

describe("Booking Tests", function(){

    //after(function (done) {
    //    server.close();
    //    done();
    //});

    //beforeEach(function(done){
    //    done();
    //});

    //afterEach(function(){
    //    //done();
    //    //server.close();
    //    return;
    //});

    it("A server should respond with status 200 on /api/booking GET", function () {
        chai.request(server)
            .get('/api/booking')
            .end(function(err, res){
                res.should.have.status(200);
            });

    });
    //
    it("A server should respond with JSON Object on /api/booking GET", function () {
        chai.request(server)
            .get('/api/booking')
            .end(function(err, res){
                res.should.be.json;
            });
    });

    it("A booking should contain purpose on /api/booking GET", function () {
        chai.request(server)
            .get('/api/booking')
            .end(function(err, res){
                res.body.should.have.property("purpose");
            });
    });

    it("A booking should contain status on /api/booking GET", function () {
        chai.request(server)
            .get('/api/booking')
            .end(function(err, res){
                res.body.should.have.property("status");
            });
    });


    it("A booking should contain lastModified on /api/booking GET", function () {
        chai.request(server)
            .get('/api/booking')
            .end(function(err, res){
                res.body.should.have.property("lastModified");
            });
    });


    it("A booking should contain _id on /api/booking GET", function () {
        chai.request(server)
            .get('/api/booking')
            .end(function(err, res){
                res.body.should.have.property("_id");
            });
    });


    it("A booking should contain startTime on /api/booking GET", function () {
        chai.request(server)
            .get('/api/booking')
            .end(function(err, res){
                res.body.should.have.property("startTime");
            });
    });


    it("A booking should contain endTime on /api/booking GET", function () {
        chai.request(server)
            .get('/api/booking')
            .end(function(err, res){
                res.body.should.have.property("endTime");
            });
    });


    it("A booking should contain createDate on /api/booking GET", function () {
        chai.request(server)
            .get('/api/booking')
            .end(function(err, res){
                res.body.should.have.property("createDate");
            });
    });


    it("A booking should contain requestor on /api/booking GET", function () {
        chai.request(server)
            .get('/api/booking')
            .end(function(err, res){
                res.body.should.have.property("requestor");
            });
    });


    //it("A booking should contain __v on /api/booking GET", function (done) {
    //    chai.request(server)
    //        .get('/api/booking')
    //        .end(function(err, res){
    //            res.body.should.have.property("__v");
    //            done();
    //        });
    //});

    //it("Booking Test GET - should return JSON with all fields in Booking Schema", function(){
    //    expect(true).to.be.true;
    //
    //});
    //it("Booking Test GET - should return JSON with _id field", function(){
    //      chai.request(server)
    //            .get('/api/booking')
    //            .end(function(err, res){
    //                res.body.should.have.property("_id");
    //                done();
    //});
    //it("Booking Test GET - should return JSON with _id field", function(){
    //        chai.request(server)
    //            .get('/api/booking')
    //            .end(function(err, res){
    //                res.body.should.have.property("startTime");
    //                done();
    //});
    //it("Booking Test GET - should return JSON with _id field", function(){
    //        chai.request(server)
    //            .get('/api/booking')
    //            .end(function(err, res){
    //                res.body.should.have.property("endTime");
    //                done();
    //});
    //it("Booking Test GET - should return JSON with _id field", function(){
    //        chai.request(server)
    //            .get('/api/booking')
    //            .end(function(err, res){
    //                res.body.should.have.property("purpose");
    //                done();
    //});
    //it("Booking Test GET - should return JSON with _id field", function(){
    //        chai.request(server)
    //            .get('/api/booking')
    //            .end(function(err, res){
    //                res.body.should.have.property("status");
    //                done();
    //});
    //it("Booking Test GET - should return JSON with _id field", function(){
    //        chai.request(server)
    //            .get('/api/booking')
    //            .end(function(err, res){
    //                res.body.should.have.property("priority");
    //                done();
    //});
    //it("Booking Test GET - should return JSON with _id field", function(){
    //        chai.request(server)
    //            .get('/api/booking')
    //            .end(function(err, res){
    //                res.body.should.have.property("createDate");
    //                done();
    //});
    //it("Booking Test GET - should return JSON with _id field", function(){
    //        chai.request(server)
    //            .get('/api/booking')
    //            .end(function(err, res){
    //                res.body.should.have.property("room");
    //                done();
    //});
    //it("Booking Test GET - should return JSON with _id field", function(){
    //        chai.request(server)
    //            .get('/api/booking')
    //            .end(function(err, res){
    //                res.body.should.have.property("requestor");
    //                done();
    //});
    //it("Booking Test POST - should return JSON with all success/failure message", function(){
    //    expect(true).to.be.true;
    //
    //});
    //it("Booking Test POST - response should be JSON", function(){
    //    expect(true).to.be.true;
    //
    //});
    //it("Booking Test PUT - response should be JSON with updated Booking", function(){
    //    expect(true).to.be.true;
    //
    //});
    //it("Booking Test DELETE - response should be JSON with delete message", function(){
    //    expect(true).to.be.true;
    //
    //});

    //
    //it("A server should create booking and return with newly added booking on /api/booking POST", function(){
    //    //TO-DO
    //    expect(true).to.be.true;
    //
    //});

    //it("A server should respond with status 200 on /api/booking GET", function(){
    //    chai.request(server)
    //        .get('/api/booking')
    //        .end(function(err, res){
    //            res.should.have.status(200);
    //        })
    //
    //});
    //
    //it("A server should respond with JSON Object on /api/booking GET", function(done){
    //    chai.request(server)
    //        .get('/api/booking')
    //        .end(function(err, res){
    //            res.should.have.status(200);
    //            res.should.be.json;
    //            done();
    //        })
    //
    //});
    //
    //it("A booking should contain the properties - _id, startTime, endTime, purpose, status, priority, createDate, room and requestor", function(done){
    //    chai.request(server)
    //        .get('/api/booking')
    //        .end(function(err, res){
    //            res.body.should.have.property("_id");
    //            res.body.should.have.property("startTime");
    //            res.body.should.have.property("endTime");
    //            res.body.should.have.property("purpose");
    //            res.body.should.have.property("status");
    //            res.body.should.have.property("priority");
    //            res.body.should.have.property("createDate");
    //            res.body.should.have.property("room");
    //            res.body.should.have.property("requestor");
    //            // res.body.should.have.property("lastModified"); -Optional
    //            done();
    //        })
    //
    //});



    //it("A Booking should be made on api/booking/ POST", function(done){
    //    //console.log("Called ");
    //        //this.timeout(0);
    //         chai.request(server)
    //            .post('/api/booking')
    //            .send({"purpose": "Purpose 4", "startDate": "2016-03-20", "endDate": "2016-03-22", "startTime": "01:30", "endTime": "03:30", "requestor": { "email": "jannunzi@gmail.com" }, "roomNumber": "111"})
    //            .end(function(err, res){
    //                 //res.should.be.json;
    //                //console.log(res.error);
    //                expect(true).to.be(true);
    //
    //            })
    //    });



    //Paste Here
    it("A response on Booking on api/booking POST should have status 200", function(){
        chai.request(server)
                    .post('/api/booking')
                    .send({ "purpose": "Purpose 85", "startDate": "2016-04-20", "endDate": "2016-04-21", "startTime": "01:30", "endTime": "03:30", "requestor": { "email": "jannunzi@gmail.com" }, "roomNumber": "111", "roomDetails": { "roomNumber": "111", "projector": true, "capacity": 50 } })
                    .end(function(err, res){
                        res.should.have.status(200);
                        done();
                    });
    });
    it("A response on Booking on api/booking POST should be json", function(){
        chai.request(server)
            .post('/api/booking')
            .send({ "purpose": "Purpose 85", "startDate": "2016-04-20", "endDate": "2016-04-21", "startTime": "01:30", "endTime": "03:30", "requestor": { "email": "jannunzi@gmail.com" }, "roomNumber": "111", "roomDetails": { "roomNumber": "111", "projector": true, "capacity": 50 } })
            .end(function(err, res){
                res.should.be.json;
                done();
            });
    });
    it("A response on Booking on api/booking POST should contain __v property", function(){
        chai.request(server)
            .post('/api/booking')
            .send({ "purpose": "Purpose 85", "startDate": "2016-04-20", "endDate": "2016-04-21", "startTime": "01:30", "endTime": "03:30", "requestor": { "email": "jannunzi@gmail.com" }, "roomNumber": "111", "roomDetails": { "roomNumber": "111", "projector": true, "capacity": 50 } })
            .end(function(err, res){
                res.body.should.have.property('__v');
                done();
            });
    });
    it("A response on Booking on api/booking POST should contain roomNumber property", function(){
        chai.request(server)
            .post('/api/booking')
            .send({ "purpose": "Purpose 85", "startDate": "2016-04-20", "endDate": "2016-04-21", "startTime": "01:30", "endTime": "03:30", "requestor": { "email": "jannunzi@gmail.com" }, "roomNumber": "111", "roomDetails": { "roomNumber": "111", "projector": true, "capacity": 50 } })
            .end(function(err, res){
                res.body.should.have.property('roomNumber');
                done();
            });
    });
    it("A response on Booking on api/booking POST should contain _id property", function(){
        chai.request(server)
            .post('/api/booking')
            .send({ "purpose": "Purpose 85", "startDate": "2016-04-20", "endDate": "2016-04-21", "startTime": "01:30", "endTime": "03:30", "requestor": { "email": "jannunzi@gmail.com" }, "roomNumber": "111", "roomDetails": { "roomNumber": "111", "projector": true, "capacity": 50 } })
            .end(function(err, res){
                res.body.should.have.property('_id');
                done();
            });
    });
    it("A response on Booking on api/booking POST should contain lastModified property", function(){
        chai.request(server)
            .post('/api/booking')
            .send({ "purpose": "Purpose 85", "startDate": "2016-04-20", "endDate": "2016-04-21", "startTime": "01:30", "endTime": "03:30", "requestor": { "email": "jannunzi@gmail.com" }, "roomNumber": "111", "roomDetails": { "roomNumber": "111", "projector": true, "capacity": 50 } })
            .end(function(err, res){
                res.body.should.have.property('lastModified');
                done();
            });
    });
    it("A response on Booking on api/booking POST should contain description property", function(){
        chai.request(server)
            .post('/api/booking')
            .send({ "purpose": "Purpose 85", "startDate": "2016-04-20", "endDate": "2016-04-21", "startTime": "01:30", "endTime": "03:30", "requestor": { "email": "jannunzi@gmail.com" }, "roomNumber": "111", "roomDetails": { "roomNumber": "111", "projector": true, "capacity": 50 } })
            .end(function(err, res){
                res.body.should.have.property('description');
                done();
            });
    });
    it("A response on Booking on api/booking POST should contain active property", function(){
        chai.request(server)
            .post('/api/booking')
            .send({ "purpose": "Purpose 85", "startDate": "2016-04-20", "endDate": "2016-04-21", "startTime": "01:30", "endTime": "03:30", "requestor": { "email": "jannunzi@gmail.com" }, "roomNumber": "111", "roomDetails": { "roomNumber": "111", "projector": true, "capacity": 50 } })
            .end(function(err, res){
                res.body.should.have.property('active');
                done();
            });
    });
    it("A response on Booking on api/booking POST should contain details", function(){
        chai.request(server)
            .post('/api/booking')
            .send({ "purpose": "Purpose 85", "startDate": "2016-04-20", "endDate": "2016-04-21", "startTime": "01:30", "endTime": "03:30", "requestor": { "email": "jannunzi@gmail.com" }, "roomNumber": "111", "roomDetails": { "roomNumber": "111", "projector": true, "capacity": 50 } })
            .end(function(err, res){
                res.body.should.have.property('details');
                done();
            });
    });
    it("A response on Booking on api/booking POST should contain details.projector", function(){
        chai.request(server)
            .post('/api/booking')
            .send({ "purpose": "Purpose 85", "startDate": "2016-04-20", "endDate": "2016-04-21", "startTime": "01:30", "endTime": "03:30", "requestor": { "email": "jannunzi@gmail.com" }, "roomNumber": "111", "roomDetails": { "roomNumber": "111", "projector": true, "capacity": 50 } })
            .end(function(err, res){
                res.body.details.should.have.property('projector');
                done();
            });
    });
    it("A response on Booking on api/booking POST should contain details.capacity", function(){
        chai.request(server)
            .post('/api/booking')
            .send({ "purpose": "Purpose 85", "startDate": "2016-04-20", "endDate": "2016-04-21", "startTime": "01:30", "endTime": "03:30", "requestor": { "email": "jannunzi@gmail.com" }, "roomNumber": "111", "roomDetails": { "roomNumber": "111", "projector": true, "capacity": 50 } })
            .end(function(err, res){
                res.body.details.should.have.property('capacity');
                done();
            });
    });
    it("A response on Booking on api/booking POST should contain details.blueJeans", function(){
        chai.request(server)
            .post('/api/booking')
            .send({ "purpose": "Purpose 85", "startDate": "2016-04-20", "endDate": "2016-04-21", "startTime": "01:30", "endTime": "03:30", "requestor": { "email": "jannunzi@gmail.com" }, "roomNumber": "111", "roomDetails": { "roomNumber": "111", "projector": true, "capacity": 50 } })
            .end(function(err, res){
                res.body.details.should.have.property('blueJeans');
                done();
            });
    });


})
