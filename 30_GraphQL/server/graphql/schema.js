// In this file we define the queries , mutations and types we work with in our project.

const { buildSchema } = require('graphql');

// BuildSchema allows us to build a schema which can then be parsed by graphql and by express-graphql.

// We define our schema in the string we pass.

// the query field in the schema will be an object will all the queries and queries are the part where we get data.

// We add type for the query called RootQuery. This type is query called hello which returns a string. To add return type we add type after :.

// In our schema we set up our queries which is made up of sub-queries (hello) which then need resolvers.

// Type is made requerrid by adding !.

// module.exports = buildSchema(`
//     type TestData{
//         text: String!
//         views: Int!
//     }

//     type RootQuery {
//         hello: TestData! 
//     }

//     schema {
//         query: RootQuery
//     }
// `);

// Defining different mutations in the following schema.

// In the following code we create a createUser mutation which requires some input, some arguments.

// We can add paranthesis after the query where we can pass in the arguments requirred by our query.

// we bundle the userInput in one object we expect and we pass it to createUser function.

// We use the type keyword rather there is a special keyword for the data we take in as input, so for the data that is used as a argument. That is the input keyword.(We use that for the UserInputData)

// We all define a new type which is returned when the user is created that type is User. 

// ID type is special data type provided by graphql for unique values.

// We also define a type for posts (Post type).

// GraphQL doesnt know data so we use String for it.

// Also if want something as an array of a type we enclose it within [].

module.exports=buildSchema(`
    type Post {
        _id: ID!
        title: String!
        content: String!
        imageUrl: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }

    type User {
        _id: ID!
        name: String!
        email: String!
        password: String,
        status: String!
        posts:[Post!]!
    }

    input UserInputData{
        email: String!
        name: String!
        password: String!
    }

    type RootMutation {
        createUser(userInput: UserInputData): User!
    }

    type RootQuery{
        hello:String
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);