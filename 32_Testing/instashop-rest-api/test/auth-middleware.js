const { expect } = require("chai");
const jwt = require("jsonwebtoken");
const sinon = require("sinon");

const authMiddleware = require("../middleware/is-auth");

// Mocha gives us more than it function. It also give us a describe function, a desribe function is there to group our tests and we can nest as many describe functions we want.

// describe also takes a title which is like a header which we are describing.

// describe takes a function as a second argument and into this function we pass all our test cases as it function calls.

describe("Auth-middleware", function () {
  // Following can be called an unit test since we are testing one unit of our code.

  // An integration test would be where we test a more complete flow so where we maybe test whether the request is routed correctly and then also the middleware and then also the controller function. But we dont often do that coz its very complex to test.

  it("Should throw an error if not authorization header is present", function () {
    // We are creating a dummy request to check whether the middleware so that we can make sure that it doesn't return anything on get.

    const req = {
      get: function (headerName) {
        return null; // No authorisation header
      },
    };

    // We expect it to throw an error with the message of Not authenticated.

    // But when we call this function it throws an error so we dont want to call it ourselves we want our testing framework (mocha and chai) to call it.

    // So instead of calling the auth middleware we pass a reference to it in our expect function and we only want to bind the arguments we eventually want to pass.

    // Bind requires the input for the this keyword.

    // So we are passing the prepared reference instead of calling the function.
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
      "Not authenticated"
    );
  });

  it("Should throw an error if the auth header is only one string", function () {
    const req = {
      get: function (headerName) {
        return "Bearer";
      },
    };

    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

  it("Should throw an error if the token cannot be verified", function () {
    const req = {
      get: function (headerName) {
        return "Bearer xyz"; // this is not a valid token hence must throw an error
      },
    };

    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

  // To test the schenario where we do have a valid token and were we test the rest of the code we want to shut down verify and make sure it simply gives us an object with a user ID so that we can pull the user Id from the object.

  // To solve the issue we can override the verify method in jwt package so it will override this method globally.

  // When we run npm test our own function will be executed and will not throw us an error.

  // Manually overriding the function has a huge downside becuase if we move this test above the test in which we pass an invalid token it will not throw an error for invalid token and that test will fail.

  it("Should yield a userId after decoding the token", function () {
    const req = {
      get: function (headerName) {
        return "Bearer xyzassdfsfsdfdsfds"; // the token is not valid hence we will get an error.
      },
    };

    // // Manually overriding external dependency
    // jwt.verify = function () {
    //   return { userId: "abc" };
    // };

    // Using sinon to deal with external dependency

    // In the stub function we pass in the object we want to replace and then the method name as a string.

    // Now sinon will replace that and by default it replaces it with an empty function.
    sinon.stub(jwt, "verify");

    // Then we call the returns method on the jwt stub which is added by sinon.

    // So now verify is in the end , an object which cannot be executed but can be configured and returns allow us to configure what this function should return.
    jwt.verify.returns({ userId: "abc" });

    // So now whenever we can jwt verify we will call the stub method.

    authMiddleware(req, {}, () => {});
    expect(req).to.have.property("userId");
    expect(req).to.have.property("userId", "abc"); // this is the user id we set.

    // Also the stub registers function call and hence we can confirm that the verify method is called like the following :
    expect(jwt.verify.called).to.be.true;

    // After doing our test we can restore the jwt verify method to its inital value.
    jwt.verify.restore();
  });
});
