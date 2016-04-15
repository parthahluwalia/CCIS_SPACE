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
    //POST
    it("A response on api/member POST should have status 200", function(){
        chai.request(server)
            .post('/api/member')
            .send({ "email": "professor2@ccs.neu.edu", "phone": "9090909090", "fname": "Professor", "lname": "X", "tags": "admin" })
            .end(function(err, res){
                res.should.have.status(200);
                done();
        });
    });
    it("A response on api/member POST should be json", function(){
        chai.request(server)
            .post('/api/member')
            .send({ "email": "professor2@ccs.neu.edu", "phone": "9090909090", "fname": "Professor", "lname": "X", "tags": "admin" })
            .end(function(err, res){
                res.should.be.json;
                done();
        });
    });
    it("A response on api/member POST should contain phone property", function(){
        chai.request(server)
            .post('/api/member')
            .send({ "email": "professor2@ccs.neu.edu", "phone": "9090909090", "fname": "Professor", "lname": "X", "tags": "admin" })
            .end(function(err, res){
                res.body.should.have.property('phone');
                done();
        });
    });
    it("A response on api/member POST should contain password property", function(){
        chai.request(server)
            .post('/api/member')
            .send({ "email": "professor2@ccs.neu.edu", "phone": "9090909090", "fname": "Professor", "lname": "X", "tags": "admin" })
            .end(function(err, res){
                res.body.should.have.property('password');
                done();
        });
    });
    it("A response on api/member POST should contain email property", function(){
        chai.request(server)
            .post('/api/member')
            .send({ "email": "professor2@ccs.neu.edu", "phone": "9090909090", "fname": "Professor", "lname": "X", "tags": "admin" })
            .end(function(err, res){
                res.body.should.have.property('email');
                done();
        });
    });
    it("A response on api/member POST should contain _id property", function(){
        chai.request(server)
            .post('/api/member')
            .send({ "email": "professor2@ccs.neu.edu", "phone": "9090909090", "fname": "Professor", "lname": "X", "tags": "admin" })
            .end(function(err, res){
                res.body.should.have.property('_id');
                done();
        });
    });
    it("A response on api/member POST should contain lastModified property", function(){
        chai.request(server)
            .post('/api/member')
            .send({ "email": "professor2@ccs.neu.edu", "phone": "9090909090", "fname": "Professor", "lname": "X", "tags": "admin" })
            .end(function(err, res){
                res.body.should.have.property('lastModified');
                done();
        });
    });
    it("A response on api/member POST should contain tags property", function(){
        chai.request(server)
            .post('/api/member')
            .send({ "email": "professor2@ccs.neu.edu", "phone": "9090909090", "fname": "Professor", "lname": "X", "tags": "admin" })
            .end(function(err, res){
                res.body.should.have.property('tags');
                done();
        });
    });
    it("A response on api/member POST should contain tags.admin property", function(){
        chai.request(server)
            .post('/api/member')
            .send({ "email": "professor2@ccs.neu.edu", "phone": "9090909090", "fname": "Professor", "lname": "X", "tags": "admin" })
            .end(function(err, res){
                res.body.tags.should.have.property('admin');
                done();
        });
    });
    it("A response on api/member POST should contain name property", function(){
        chai.request(server)
            .post('/api/member')
            .send({ "email": "professor2@ccs.neu.edu", "phone": "9090909090", "fname": "Professor", "lname": "X", "tags": "admin" })
            .end(function(err, res){
                res.body.should.have.property('name');
                done();
        });
    });
    it("A response on api/member POST should contain name.first property", function(){
        chai.request(server)
            .post('/api/member')
            .send({ "email": "professor2@ccs.neu.edu", "phone": "9090909090", "fname": "Professor", "lname": "X", "tags": "admin" })
            .end(function(err, res){
                res.body.name.should.have.property('first');
                done();
            });
    });
    it("A response on api/member POST should contain name.last property", function(){
        chai.request(server)
            .post('/api/member')
            .send({ "email": "professor2@ccs.neu.edu", "phone": "9090909090", "fname": "Professor", "lname": "X", "tags": "admin" })
            .end(function(err, res){
                res.body.name.should.have.property('last');
                done();
            });
    });

    // PUT
    //it("A response on api/member PUT should give return json", function(done) {
    //    chai.request(server)
    //        .put('/api/member')
    //        .send({"email": "mishra.ak@husky.neu.edu", "phone" : "101010101010"})
    //        .end(function(err, res){
    //            res.should.be.json;
    //            done();
    //        });
    //});
    //it("A response on api/member PUT should have status 200", function(done) {
    //    chai.request(server)
    //        .put('/api/member')
    //        .send({"email": "mishra.ak@husky.neu.edu", "phone" : "101010101010"})
    //        .end(function(err, res){
    //            res.should.have.status(200);
    //            done();
    //        });
    //});

})