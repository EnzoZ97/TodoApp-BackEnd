"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const database_1 = require("./database/database");
const mongodb_1 = require("mongodb");
const dotenv = require("dotenv");
const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
const dbName = "TodoApp";
const collectionName = "user";
const database = database_1.client.db(dbName);
const collection = database.collection(collectionName);
app.post('/api/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    try {
        const insertOneUser = yield collection.insertOne(user);
        res.json(insertOneUser);
    }
    catch (err) {
        res.status(500).json({ err: 'has been an error to try to create an user' });
    }
}));
app.get('/api', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    let list = [];
    try {
        const users = collection.find({});
        try {
            for (var _d = true, users_1 = __asyncValues(users), users_1_1; users_1_1 = yield users_1.next(), _a = users_1_1.done, !_a; _d = true) {
                _c = users_1_1.value;
                _d = false;
                const user = _c;
                list.push(user);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = users_1.return)) yield _b.call(users_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        res.json(list);
    }
    catch (err) {
        res.status(500).json({ err: 'has been an error to try to get the users' });
    }
}));
app.patch('/api/update/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const myObjectId = new mongodb_1.ObjectId(id);
    const findOneQuery = {
        _id: myObjectId
    };
    const updateDoc = {
        $set: req.body
    };
    try {
        const updateResult = yield collection.updateOne(findOneQuery, updateDoc);
        res.json(updateResult);
    }
    catch (err) {
        res.status(500).json({ err: `Something went wrong trying to update one document: ${err}` });
    }
}));
app.delete('/api/delete/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const objectId = new mongodb_1.ObjectId(id);
    const deleteQuery = { _id: objectId };
    try {
        const deleteResult = yield collection.deleteOne(deleteQuery);
        res.status(200).json(deleteResult);
    }
    catch (err) {
        res.status(400).json({ err: `Something went wrong trying to delete documents: ${err}` });
    }
}));
database_1.client.connect()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`the application is listening the port ${PORT}`);
    });
})
    .catch((err) => {
    console.error(err);
});
