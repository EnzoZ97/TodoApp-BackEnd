"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const dotenv = require("dotenv");
const mongodb_1 = require("mongodb");
dotenv.config();
let url = process.env.MONGO_URI;
exports.client = new mongodb_1.MongoClient(String(url));
