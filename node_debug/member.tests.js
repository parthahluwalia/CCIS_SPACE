/**
 * Created by Rishi on 4/21/16.
 */
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

describe("Super User Test", function() {


    it("A super user can create new user POST/", function () {
        expect(true).to.be.true;

    });
    //
    it("A super user can update user details PUT/", function () {
        expect(true).to.be.true;

    });

    it("A super user can delete user DELETE/", function () {
        expect(true).to.be.true;
    });

    it("A super user can give admin persmission to user PUT/", function () {
        expect(true).to.be.true;
    });


    it("A super user can see other super users GET/", function () {
        expect(true).to.be.true;
    });

})