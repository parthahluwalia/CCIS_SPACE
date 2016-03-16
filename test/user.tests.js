/**
 * Created by Rishi on 3/16/16.
 */
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var expect = require('chai').expect;
var server = require('../');


chai.use(chaiHttp);
chai.should();


describe("User Tests", function(){

    it("User tests - Foo", function(){
        expect(true).to.be.true;

    });

})