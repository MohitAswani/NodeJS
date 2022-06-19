const path = require("path");
const Crypto = require("crypto");

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const { graphqlHTTP } = require("express-graphql");
const cors = require("cors");

const graphqlSchema = require("./graphql/schema");
const graphqlResolvers = require("./graphql/resolvers");

const auth = require("./middleware/auth");

const { clearImage } = require("./util/file");

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    Crypto.randomBytes(8, (err, buff) => {
      if (err) {
        err.statusCode = 500;
        throw err;
      }

      const filename = "file-" + buff.toString("hex") + "-" + file.originalname;
      cb(null, filename);
    });
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(express.json());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

app.use("/images", express.static(path.join(__dirname, "images")));

const corsOptions = {
  origin: "*",
  methods: "GET,POST,PUT,PATCH,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

// Using the cors module to set headers.
app.use(cors(corsOptions));

app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(auth);

app.put("/post-image", (req, res, next) => {
  if (!req.isAuth) {
    throw new Error("Not authenticated!");
  }
  if (!req.file) {
    return res.status(200).json({ message: "No file provided!" });
  }
  if (req.body.oldPath) {
    clearImage(req.body.oldPath);
  }
  return res
    .status(201)
    .json({ message: "File stored.", filePath: req.file.filename });
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
    customFormatErrorFn(err) {
      if (!err.originalError) {
        return err;
      }

      const data = err.originalError.data;

      const message = err.message || "An error occured";

      const code = err.originalError.code || 500;

      return { message: message, status: code, data: data };
    },
  })
);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({
    message: message,
    data: data,
  });
});

mongoose
  .connect(process.env.MONGO_DB_CONNECTION_URI)
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
