require("dotenv").config();
const { expect } = require("chai");
const sinon = require("sinon");
const mongoose = require("mongoose");

const User = require("../models/user");
const Post = require("../models/post");
const FeedController = require("../controllers/feed");

// Describe provides us a way of running certain extra functions before every it function or after it function inside the describe.

// We can run some statements before every test by using before statement. Before takes a function and if we execute async code in there we should add a done argument as well.

// Before only executes once not before every test case but before all test cases.

// And the same goes for the cleanup work, clearing our user and disconnecting is what we will do after all the test cases only once. And we do that in the after block and not in the it block.

// For the test cases which require different hooks we will use different describe block.

// So along with before and after we also have beforeEach and afterEach the difference between the two being that these hooks will run before and after every test/it function.

describe("Feed Controller", function () {
  before(function (done) {
    mongoose
      .connect(process.env.MONGO_DB_CONNECTION_URI_TEST)
      .then((result) => {
        const user = new User({
          email: "test@test.com",
          password: "testpassword",
          name: "Test",
          posts: [],
          _id: "5c0f66b979af55031b34728a",
        });

        return user.save();
      })
      .then(() => {
        done();
      });
  });

  beforeEach(function (done) {
    done();
  });

  // Now inside of this we connect to the testing database and make sure there is a user in the database and we retreive the status for the user with a status code of 200.

  // Also the reason mocha doesn't exit the process of running the test is that mocha detects that there is a running process in the event loop and hence it doesn't stop running. The running process is the database connection.

  // Hence we close the connection to the database after we are done with our test.

  // Also to prevent duplicate id error we need to delete the user we create before ending the test.

  // Whenever a test fail we won't make it to the clean up part and in general this code is pretty clunky and pretty hard to read code and if we have another test that requires our database setup then we will have to repeat all this.

  // A cleaner way of doing is to use lifecycle hooks provided by mocha.

  it("Should send a response with a valid user status for an existing user", function (done) {
    const req = { userId: "5c0f66b979af55031b34728a" };
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.userStatus = data.status;
      },
    };

    FeedController.getStatus(req, res, () => {}).then(() => {
      expect(res.statusCode).to.be.equal(200);
      expect(res.userStatus).to.be.equal("Helloo");

      done();

      // Clean up code
      // User.deleteMany({}) // deleting every user.
      //   .then(() => {
      //     return mongoose.disconnect();
      //   })
      //   .then(() => {
      //     done();
      //   });
    });
  });

  // Testing a controller function the requires authetication : for such a function we directly call the function and we manually set the userId in our req object.

  it("Should add a created post to the posts of the creater", function (done) {
    const req = {
      body: {
        title: "Test post",
        content: "Test content",
      },
      file: {
        path: "/testpath",
      },
      userId: "5c0f66b979af55031b34728a",
    };

    const res = {
      status: function () {
        return this; // so that we return the reference to this object and hence chain function calls.
      },
      json: function () {},
    };

    FeedController.postPost(req, res, () => {}).then((savedUser) => {
      expect(savedUser).to.have.property("posts");
      expect(savedUser.posts).to.have.length(1);

      done();
    });
  });

  after(function (done) {
    User.deleteMany({}) // deleting every user.
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });

  afterEach(function (done) {
    done();
  });
});
