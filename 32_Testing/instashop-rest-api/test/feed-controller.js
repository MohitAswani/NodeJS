require("dotenv").config();
const { expect } = require("chai");
const sinon = require("sinon");
const mongoose = require("mongoose");

const User = require("../models/user");
const FeedController = require("../controllers/feed");

describe("Feed Controller", function () {
  // Now inside of this we connect to the testing database and make sure there is a user in the database and we retreive the status for the user with a status code of 200.

  // Also the reason mocha doesn't exit the process of running the test is that mocha detects that there is a running process in the event loop and hence it doesn't stop running. The running process is the database connection.

  // Hence we close the connection to the database after we are done with our test.

  // Also to prevent duplicate id error we need to delete the user we create before ending the test.

  it("Should send a response with a valid user status for an existing user", function (done) {
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
        const req = {
          userId: "5c0f66b979af55031b34728a",
        };
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
          User.deleteMany({}) // deleting every user.
            .then(() => {
              return mongoose.disconnect();
            })
            .then(() => {
              done();
            });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
