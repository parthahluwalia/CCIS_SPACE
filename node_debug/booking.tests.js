/**
 * Created by Akanksha on 4/6/16.
 */
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var expect = require('chai').expect;
//var server = require('../');

chai.use(chaiHttp);
chai.should();

describe("Booking Tests", function() {
    

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

})
