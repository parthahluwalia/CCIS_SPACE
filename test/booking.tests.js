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

    it("Booking Dummy Test", function(){
        expect(true).to.be.true;

    });

    it("A server should create booking and return with newly added booking on /api/booking POST", function(){
        //TO-DO
        expect(false).to.be.false;

    })

    it("A server should respond with status 200 on /api/booking GET", function(){
        chai.request(server)
            .get('/api/booking')
            .end(function(err, res){
                res.should.have.status(200);
            })

    });

    it("A server should respond with JSON Object on /api/booking GET", function(done){
        chai.request(server)
            .get('/api/booking')
            .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                done();
            })

    });

    it("A booking should contain the properties - _id, startTime, endTime, purpose, status, priority, createDate, room and requestor", function(done){
        chai.request(server)
            .get('/api/booking')
            .end(function(err, res){
                res.body.should.have.property("_id");
                res.body.should.have.property("startTime");
                res.body.should.have.property("endTime");
                res.body.should.have.property("purpose");
                res.body.should.have.property("status");
                res.body.should.have.property("priority");
                res.body.should.have.property("createDate");
                res.body.should.have.property("room");
                res.body.should.have.property("requestor");
                // res.body.should.have.property("lastModified"); -Optional
                done();
            })

    });

})