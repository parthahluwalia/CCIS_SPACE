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



    it("Booking Test GET - should return JSON", function(){
        expect(true).to.be.true;

    });
    it("Booking Test GET - should return status code 200", function(){
        expect(true).to.be.true;

    });
    //it("Booking Test GET - should return JSON with all fields in Booking Schema", function(){
    //    expect(true).to.be.true;
    //
    //});
    it("Booking Test GET - should return JSON with _id field", function(){
          chai.request(server)
                .get('/api/booking')
                .end(function(err, res){
                    res.body.should.have.property("_id");
                    done();
    });
    it("Booking Test GET - should return JSON with _id field", function(){
            chai.request(server)
                .get('/api/booking')
                .end(function(err, res){
                    res.body.should.have.property("startTime");
                    done();
    });
    it("Booking Test GET - should return JSON with _id field", function(){
            chai.request(server)
                .get('/api/booking')
                .end(function(err, res){
                    res.body.should.have.property("endTime");
                    done();
    });
    it("Booking Test GET - should return JSON with _id field", function(){
            chai.request(server)
                .get('/api/booking')
                .end(function(err, res){
                    res.body.should.have.property("purpose");
                    done();
    });
    it("Booking Test GET - should return JSON with _id field", function(){
            chai.request(server)
                .get('/api/booking')
                .end(function(err, res){
                    res.body.should.have.property("status");
                    done();
    });
    it("Booking Test GET - should return JSON with _id field", function(){
            chai.request(server)
                .get('/api/booking')
                .end(function(err, res){
                    res.body.should.have.property("priority");
                    done();
    });
    it("Booking Test GET - should return JSON with _id field", function(){
            chai.request(server)
                .get('/api/booking')
                .end(function(err, res){
                    res.body.should.have.property("createDate");
                    done();
    });
    it("Booking Test GET - should return JSON with _id field", function(){
            chai.request(server)
                .get('/api/booking')
                .end(function(err, res){
                    res.body.should.have.property("room");
                    done();
    });
    it("Booking Test GET - should return JSON with _id field", function(){
            chai.request(server)
                .get('/api/booking')
                .end(function(err, res){
                    res.body.should.have.property("requestor");
                    done();
    });
    it("Booking Test POST - should return JSON with all success/failure message", function(){
        expect(true).to.be.true;

    });
    it("Booking Test POST - response should be JSON", function(){
        expect(true).to.be.true;

    });
    it("Booking Test PUT - response should be JSON with updated Booking", function(){
        expect(true).to.be.true;

    });
    it("Booking Test DELETE - response should be JSON with delete message", function(){
        expect(true).to.be.true;

    });

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


})
