// In this file we define the logic which is executed for incoming queries.
const User = require('../models/user');
const bcrypt = require('bcryptjs');


module.exports = {

    // We need a method for all the queries we define in our schema and the name has to be same as the query name.

    // hello(){
    //     return {
    //         text: 'Hello World!',
    //         views: 14
    //     }
    // }

    // On the incoming args argument we can retrieve all the data we defined in the schema.

    // Not directly on the args rather args will be object containing all the arguments passed in the function.

    createUser: async function(args, req){
        // const email = args.userInput.email; One options to retrieve data 

        const { userInput }=args;  // or we can use object destructuring

        // IMPORTANT NODE : IF WE ARE NOT USING ASYNC AWAIT WE NEED TO RETURN THE FINDONE QUERY WHERE WE THEN ADD THEN BECUASE IF WE DONT RETURN OUR PROMISE IN OUR RESOLVER GRAPHQL WILL NOT WAIT FOR IT TO BE RESOLVED.

        // WHEN USING ASYNC-AWAIT IT IS AUTOMATICALLY RETURNED FOR US.

        const existingUser=await User.findOne({email:userInput.email});

        if(existingUser){
            const error=new Error('User exists already');
            throw error;
        }

        const hashedPassword=await bcrypt.hash(userInput.password,12);

        const user=new User({
            email:userInput.email,
            name:userInput.name,
            password:hashedPassword
        });

        const createdUser = await user.save();

        // We need to return a user object as we defined in the schema.

        // ._doc only contains the user data and not the meta data mongoose would include otherwise.

        // We overise the _id because we need to convert it from an object id field to a string field.
        return {...createdUser._doc,_id:createdUser._id.toString() };
    }
}