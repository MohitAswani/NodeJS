// Logic which is executed for the incoming queries.

const bcrypt = require('bcryptjs');
const validator = require('validator');

const User = require('../models/user');

// module.exports={

//     // This will be the implementation for the hello query.

//     // In the resolver we return all the data but then graphql on the server will filter our just the data that was requested.

//     hello(){
//         return {
//             text:'Hello world',
//             views:12345
//         }
//     }
// }

// So args contains all the arguments we defined in our schema and those arguments can be retreived using the dot operator.

// We can also use destructuring the userInput from args.

// IF WE ARE NOT USING ASYNC AWAIT THEN WE NEED TO RETURN OUR FIND ONE QUERY BECAUSE IF WE DONT RETURN OUR PROMISE IN THE RESOLVER , GRAPHQL WILL NOT WAIT FOR IT TO BE RESOLVED AND WHEN USING ASYNC AWAIT ITS AUTOMATICALLY RETURNED. 

// To validate the errors using validator package we use if and else statement and return the array of errors.

// Whenever it throws an error it automatically sets the status code to 500.

module.exports = {
    createUser: async function (args, req) {
        const { email, name, password } = args.userInput;

        const errors = [];
        if (!validator.isEmail(email)) {
            errors.push({ message: 'Email is invalid' })
        }

        if (validator.isEmpty(password) ||
            !validator.isLength(password, { min: 5 })) {
            errors.push({ message: 'Password too short' })
        }

        if (errors.length > 0) {
            const error = new Error('Invalid input.');
            error.data=errors;  // populating error with our custom errors.
            error.code=422;  // validation error code
            throw error;
        }

        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            const error = new Error('User exists already!');
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
            email: email,
            name: name,
            password: hashedPassword
        });

        const createdUser = await user.save();

        // Since we need to return user object we create that using destructuring. Also we destructure the createdUser._doc which only contains the user data and not the rest of the metadata.

        // Also we need to store the id inform of a string (else is will give error) so we override the id and convert it to string.

        return { ...createdUser._doc, _id: createdUser._id.toString() };
    }
}