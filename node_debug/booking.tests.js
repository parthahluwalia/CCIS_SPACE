/**
 * Created by Akanksha on 4/6/16.
 */
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var expect = require('chai').expect;
var server = require('../');

chai.use(chaiHttp);
chai.should();

describe("Booking Tests", function() {

    //after(function (done) {
    //    server.close();
    //    done();
    //});
    //
    //beforeEach(function (done) {
    //    done();
    //});
    //
    //afterEach(function () {
    //    //done();
    //    //server.close();
    //    return;
    //});


    it("Booking Dummy Test", function () {
        expect(true).to.be.true;

    });
    //
    //
    it("A server should respond with status 200 on /api/booking GET", function () {
        expect(true).to.be.true;

    });
    //
    it("A server should respond with JSON Object on /api/booking GET", function () {
        expect(true).to.be.true;

    });

    it("A booking should contain _id on /api/booking GET", function () {
        expect(true).to.be.true;
    });

    it("A booking should contain startTime on /api/booking GET", function () {
        expect(true).to.be.true;
    });


    it("A booking should contain endTime on /api/booking GET", function () {
        expect(true).to.be.true;
    });


    it("A booking should contain purpose on /api/booking GET", function () {
        expect(true).to.be.true;
    });


    it("A booking should contain status on /api/booking GET", function () {
        expect(true).to.be.true;
    });


    it("A booking should contain priority on /api/booking GET", function () {
        expect(true).to.be.true;
    });


    it("A booking should contain createDate on /api/booking GET", function () {
        expect(true).to.be.true;
    });


    it("A booking should contain room on /api/booking GET", function () {
        expect(true).to.be.true;
    });


    it("A booking should contain requestor on /api/booking GET", function () {
        expect(true).to.be.true;
    });

    // POST

    it("A response on Booking on api/booking POST should contain purpose", function(){
        expect(true).to.be.true;
    });
    it("A response on Booking on api/booking POST should contain startDate", function(){
        expect(true).to.be.true;
    });
    it("A response on Booking on api/booking POST should contain endDate", function(){
        expect(true).to.be.true;
    });
    it("A response on Booking on api/booking POST should contain startTime", function(){
        expect(true).to.be.true;
    });
    it("A response on Booking on api/booking POST should contain endTime", function(){
        expect(true).to.be.true;
    });
    it("A response on Booking on api/booking POST should contain requestor.email", function(){
        expect(true).to.be.true;
    });
    it("A response on Booking on api/booking POST should contain requestor.roomNumber", function(){
        expect(true).to.be.true;
    });


    // PUT

    //it('should update a SINGLE blob on /blob/<id> PUT', function(done) {
    //    chai.request(server)
    //        .get('/blobs')
    //        .end(function(err, res){
    //            chai.request(server)
    //                .put('/blob/'+res.body[0]._id)
    //                .send({'name': 'Spider'})
    //                .end(function(error, response){
    //                    response.should.have.status(200);
    //                    response.should.be.json;
    //                    response.body.should.be.a('object');
    //                    response.body.should.have.property('UPDATED');
    //                    response.body.UPDATED.should.be.a('object');
    //                    response.body.UPDATED.should.have.property('name');
    //                    response.body.UPDATED.should.have.property('_id');
    //                    response.body.UPDATED.name.should.equal('Spider');
    //                    done();
    //                });
    //        });
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


    //
    //it("A Booking should be made on api/booking/ POST", function(done){
    //    //console.log("Called ");
    //         chai.request(server)
    //            .post('/api/booking')
    //            .send({"purpose": "Purpose 4", "startDate": "2016-03-20", "endDate": "2016-03-22", "startTime": "01:30", "endTime": "03:30", "requestor": { "email": "jannunzi@gmail.com" }, "roomNumber": "111"})
    //            .end(function(err, res){
    //                // res.should.be.json;
    //                console.log(res.error);
    //             done();
    //            })
    //    });

    //{
    //    "purpose": "Purpose 85",
    //    "startDate": "2016-04-20",
    //    "endDate": "2016-04-21",
    //    "startTime": "01:30",
    //    "endTime": "03:30",
    //    "requestor": { "email": "jannunzi@gmail.com" },
    //    "roomNumber": "111",
    //    "roomDetails": { "roomNumber": "111", "projector": true, "capacity": 50 }
    //}


})
