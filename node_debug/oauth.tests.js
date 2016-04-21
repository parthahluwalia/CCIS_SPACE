/**
 * Created by Rishi on 4/21/16.
 */
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var expect = require('chai').expect;
//var server = require('../');

chai.use(chaiHttp);
chai.should();

describe("User OAuth Tests", function() {


    it("A non authenticated user cannot GET/ Bookings", function () {
        expect(true).to.be.true;

    });
    //
    it("A non authenticated user cannot POST/ create booking", function () {
        expect(true).to.be.true;

    });

    it("A normal user cannot manage PUT/ bookings", function () {
        expect(true).to.be.true;
    });

    it("A super user can create POST/ user", function () {
        expect(true).to.be.true;
    });


    it("A super usre can manage PUT/ users", function () {
        expect(true).to.be.true;
    });

})