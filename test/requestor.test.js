/**
 * Created by Rishi on 3/18/16.
 */
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var expect = require('chai').expect;
var server = require('../');

chai.use(chaiHttp);
chai.should();

describe("Requestor Test", function(){

    it("Requestor Dummy Test", function(){
        expect(true).to.be.true;

    });

})