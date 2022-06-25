const { expect } = require("chai");

// We simply write a test by writing it and it is function provided by mocha, the idea is to name our tests like plain english sentences.

// it takes two argument first one is a string which describes our tests.

// second argument is a function which defines our actual test code.

// To check whether the test succeedes or not we use chai module. Mocha is responsible for running our test by giving us the it function.

// We import the expect function from chai. And inside of this function we pass the code that we want to test.

// expect returns an object and this object has a couple of properties like to and on to we have another object which gives us properties like equal which is function where we can define the value we can expect it to equal.

// it("Should add numbers correctly", function () {
//   const num1 = 2;
//   const num2 = 3;

//   expect(num1 + num2).to.equal(5);
// });

// it("Should not give a result of 6", function () {
//   const num1 = 3;
//   const num2 = 3;

//   expect(num1 + num2).not.to.equal(6);
// });
