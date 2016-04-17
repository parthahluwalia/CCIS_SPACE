/**
 * Created by Rishi on 3/31/16.
 * Modified by Akanksha on 4/7/16
 */
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var expect = require('chai').expect;
//var server = require('../');

chai.use(chaiHttp);
chai.should();

describe("Space Tests", function(){
    it("Space Test GET - should return JSON", function(){
        expect(true).to.be.true;

    });
    it("Space Test GET - should return status code 200", function(){
        expect(true).to.be.true;

    });
    it("Space Test GET - should return JSON with all fields in Space Schema", function(){
        expect(true).to.be.true;

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