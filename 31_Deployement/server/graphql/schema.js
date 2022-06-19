// In this file we will define the queries, mutations and types we work with in graphql service.

// We import the buildSchema function which allows us to build the schema which can then be parsed by graphql.

const { buildSchema } = require("graphql");

// Return the schema object.

// The query field will be an object with all the queries and queries are the part where we get data.

// We define a hello query inside the root query and we define the return type of the query by adding the data type after the query name.

// We don't need an implementation for the rootquery becuase in our schema we setup our root query which is made up of sub-queries which in turn need implementation/resolvers.

// We make requirred by adding !.

// module.exports=buildSchema(`
//     type TestData {
//         text: String!
//         views: Int!
//     }

//     type RootQuery{
//         hello: TestData!
//     }

//     schema {
//         query: RootQuery
//     }

// `);

// In the below schema we are adding mutation.

// And we are adding nested mutations in our root mutation.

// Our createUser mutation will require some user input to create the user.

// We pass the user info bundled as an object called userInput and we create a new type for this argument and we do that using the input keyword.

// Also we want our createUser function to return the user object and we define that object using the type keyword.

// Also to define id's graphql has a special type called ID.

// graphQl doesn't have data type for data so we are going to use strings for dates.

// To tell graphql we have an array of some type we enclose it in [].

// To validate the input we cannot use express-validator becuase it was used as a middleware in routes and since graphql only has one route and we want different validation we cant use it.

// So we move our validation part in resolvers.

module.exports = buildSchema(`
    type Post{
        _id:ID!
        title:String!
        content:String!
        imageUrl:String!
        creator:User!
        createdAt:String!
        updatedAt:String!
    }

    type User {
        _id: ID!
        name:String!
        email:String!
        password:String
        status:String!
        posts:[Post!]!
    }

    type AuthData {
        token:String!
        userId:String!
    }

    type PostData {
        posts:[Post!]!
        totalPosts:Int!
    }

    input UserInputData {
        email:String!
        name:String!
        password:String!
    }

    input PostInputData {
        title:String!
        content:String!
        imageUrl:String!
    }

    type RootMutation {
        createUser(userInput:UserInputData):User!
        createPost(postInput:PostInputData):Post!
        updatePost(id:ID!,postInput:PostInputData!):Post!
        deletePost(id:ID!):Boolean
        updateStatus(status:String):User!
    }

    type RootQuery {
        login(email:String!,password:String): AuthData!
        posts(page:Int!):PostData
        post(id:ID!):Post!
        user: User!
    }

    schema {
        query:RootQuery
        mutation: RootMutation
    }
`);
