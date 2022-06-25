const { expect } = require("chai");
const sinon = require("sinon");

const User = require("../models/user");
const AuthController = require("../controllers/auth");

describe("Auth Controller - Login", function () {
  // The issue with this test is that since it is an async code and it doesn't wait for this test case to finish.

  // It executes the code synchronously step by step and does not wait for the promise  to resolve . We can tell mocha to wait and we do this by adding an extra argument in this function we pass to it, and that's the done argument.

  // So its a function which we can call once the test case is done and we can call it in an async code snippet

  it("Should throw an error if accessing the database fails", function (done) {
    sinon.stub(User, "findOne");
    User.findOne.throws();

    const req = {
      body: {
        email: "test@test.com",
        password: "test",
      },
    };

    AuthController.login(req, {}, () => {}).then((result) => {
      // Chai is able to detect a couple of types of data and error is one of them.Other possible values would be string,object,null,promise and so on.
      expect(result).to.be.an("error");
      expect(result).to.have.property("statusCode", 500);
      done();
    });

    User.findOne.restore();
  });

  
});
