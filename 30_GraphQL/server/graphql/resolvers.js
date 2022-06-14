// Logic which is executed for the incoming queries.

const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Post = require("../models/post");

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
      errors.push({ message: "Email is invalid" });
    }

    if (
      validator.isEmpty(password) ||
      !validator.isLength(password, { min: 5 })
    ) {
      errors.push({ message: "Password too short" });
    }

    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors; // populating error with our custom errors.
      error.code = 422; // validation error code
      throw error;
    }

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      const error = new Error("User exists already!");
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      email: email,
      name: name,
      password: hashedPassword,
    });

    const createdUser = await user.save();

    // Since we need to return user object we create that using destructuring. Also we destructure the createdUser._doc which only contains the user data and not the rest of the metadata.

    // Also we need to store the id inform of a string (else is will give error) so we override the id and convert it to string.

    return { ...createdUser._doc, _id: createdUser._id.toString() };
  },
  login: async function (args, req) {
    const { email, password } = args;

    const user = await User.findOne({ email: email });

    if (!user) {
      const error = new Error("User not found");
      error.code = 401; // no auth
      throw error;
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      const error = new Error("Password incorrect");
      error.code = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    return { token: token, userId: user._id.toString() };
  },
  createPost: async function ({ postInput }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authentication");
      error.code = 401;
      throw error;
    }

    const errors = [];

    if (
      validator.isEmpty(postInput.title) ||
      !validator.isLength(postInput.title, { min: 5 })
    ) {
      errors.push({ mesage: "Title is invalid." });
    }

    if (
      validator.isEmpty(postInput.content) ||
      !validator.isLength(postInput.content, { min: 5 })
    ) {
      errors.push({ mesage: "Content is invalid." });
    }

    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors; // populating error with our custom errors.
      error.code = 422; // validation error code
      throw error;
    }

    const user = await User.findById(req.userId);

    if (!user) {
      const error = new Error("Invalid user.");
      error.data = errors;
      error.code = 401;
      throw error;
    }

    const post = new Post({
      title: postInput.title,
      content: postInput.content,
      imageUrl: postInput.imageUrl,
      creator: user,
    });

    const createdPost = await post.save();
    user.posts.push(createdPost);

    await user.save();

    return {
      ...createdPost._doc,
      _id: createdPost._id.toString(),
      createdAt: createdPost.createdAt.toISOString(),
      updatedAt: createdPost.updatedAt.toISOString(),
    };
  },
  posts: async function (args, req) {
    const { page } = args;

    if (!req.isAuth) {
      const error = new Error("Not authentication");
      error.code = 401;
      throw error;
    }

    if (!page) {
      page = 1;
    }

    const perPage = 2;
    const totalPosts = await Post.find().countDocuments();
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("creator");

    return {
      posts: posts.map((p) => {
        return {
          ...p._doc,
          _id: p._id.toString(),
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString(),
        };
      }),
      totalPosts: totalPosts,
    };
  },
  post: async function (args, req) {
    const { id } = args;

    if (!req.isAuth) {
      const error = new Error("Not authentication");
      error.code = 401;
      throw error;
    }

    const post = await Post.findById(id).populate("creator");

    if (!post) {
      const error = new Error("No post found");
      error.code = 401;
      throw error;
    }

    return {
      ...post._doc,
      _id: post._id.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  },
};
