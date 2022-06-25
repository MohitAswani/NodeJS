const authMiddleware = require('../middleware/is-auth');

// Following can be called an unit test since we are testing one unit of our code.

// An integration test would be where we test a more complete flow so where we maybe test whether the request is routed correctly and then also the middleware and then also the controller function. But we dont often do that coz its very complex to test.

it('Should throw an error if not authorization header is present',function(){

    // We are creating a dummy request to check whether the middleware so that we can make sure that it doesn't return anything on get.
    const req = {
        get:function(headerName){
            return null;  // No authorisation header
        }
    };

    
});