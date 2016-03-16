/**
 * Created by Rishi on 3/13/16.
 */
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var expect = require('chai').expect;
var server = require('../');
var request = require("supertest").agent(server);

chai.use(chaiHttp);
chai.should();

describe("Booking Tests", function(){

    it("Pass", function(){
        expect(true).to.be.true;

    });

    //afterEach(function (done) {
    //    //console.log("SERVER CLOSE");
    //    server.close();
    //    done();
    //});


    it("A server should respond with status 200 on /api/booking GET", function(){
        request
            .get('/api/booking')
            .end(function(err, res){
                console.log(res);
                res.should.have.statusCode(200);
            })

    });

    it("A server should respond with JSON Object on /api/booking GET", function(done){
        request
            .get('/api/booking')
            .end(function(err, res){
                console.log(res);
                res.should.have.status(200);
                res.should.be.json;
                done();
            })

    });


    it("A booking should contain the properties - name,email,purpose and resources", function(done){
        request
            .get('/api/booking')
            .end(function(err, res){
                res.body.should.have.property("name");
                res.body.should.have.property("email");
                res.body.should.have.property("purpose");
                res.body.should.have.property("resources");
                done();
            })

    });

})
