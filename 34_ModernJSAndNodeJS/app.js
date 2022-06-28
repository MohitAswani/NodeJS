// const express = require("express");

import express from 'express';   // using the new import syntax

// const resHandler = require("./response-handler");    // we will also need to change this since we set the type to module.

// We need to add .js in the file path for our files but not necessarily for third party imports.

// import resHandler from './response-handler.js';     // we will also need to change the export syntax. Also we can do this only when we use default export syntax.

import { resHandler } from './response-handler.js';   // we use this when we dont do default export. Also this is called named export and we need to use the exact name of what we export.

const app = express();

app.get("/", resHandler);

app.listen(3000);
