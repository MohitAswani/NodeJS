const { expect } = require("chai");
const sinon = require("sinon");
const mongoose = require("mongoose");

const User = require("../models/user");
const FeedController = require("../controllers/feed");

describe("Feed Controller", function () {
  // Now inside of this we connect to the testing database and make sure there is a user in the database and we retreive the status for the user with a status code of 200.

  it("Should send a response with a valid user status for an existing user", function (done) {
    mongoose
      .connect(process.env.MONGO_DB_CONNECTION_URI)
      .then((result) => {
        app.listen(8080);
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
