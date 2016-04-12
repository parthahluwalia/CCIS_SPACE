/**
 * Created by Akanksha on 4/10/16.
 */
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var expect = require('chai').expect;
var server = require('../');

chai.use(chaiHttp);
chai.should();

//GET
describe("Space Tests", function(){
    it("An /api/member GET response should return JSON", function(){
        chai.request(server)
            .get('/api/member')
            .end(function(err, res){
                res.should.be.json;
            });
    });
    it("An /api/member GET response should return status code 200", function(){
        chai.request(server)
            .get('/api/member')
            .end(function(err, res){
                res.should.have.status(200);
            });
    });
    it("An /api/member GET response should contain _id field", function () {
        chai.request(server)
            .get('/api/member')
            .end(function(err, res){
                res.body.should.have.property("_id");
            });
    });

    it("An /api/member GET response should contain phone field", function () {
        chai.request(server)
            .get('/api/member')
            .end(function(err, res){
                res.body.should.have.property("phone");
            });
    });
    it("An /api/member GET response should contain password field", function () {
        chai.request(server)
            .get('/api/member')
            .end(function(err, res){
                res.body.should.have.property("password");
            });
    });
    it("An /api/member GET response should contain email field", function () {
        chai.request(server)
            .get('/api/member')
            .end(function(err, res){
                res.body.should.have.property("email");
            });
    });
    it("An /api/member GET response should contain lastModified field", function () {
        chai.request(server)
            .get('/api/member')
            .end(function(err, res){
                res.body.should.have.property("lastModified");
            });
    });
    it("An /api/member GET response should contain tags field", function () {
        chai.request(server)
            .get('/api/member')
            .end(function(err, res){
                res.body.should.have.property("tags");
            });
    });
    it("An /api/member GET response should contain name field", function () {
        chai.request(server)
            .get('/api/member')
            .end(function(err, res){
                res.body.should.have.property("name");
            });
    });
    it("An /api/member GET response should contain name.first field", function () {
        chai.request(server)
            .get('/api/member')
            .end(function(err, res){
                res.body.name.should.have.property("first");
            });
    });
    it("An /api/member GET response should contain name.last field", function () {
        chai.request(server)
            .get('/api/member')
            .end(function(err, res){
                res.body.should.have.property("last");
            });
    });

})