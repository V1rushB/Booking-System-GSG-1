"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkToken = exports.methodChecker = void 0;
const userdata_js_1 = __importDefault(require("../data/userdata.js"));
const methodChecker = (req, res, next) => {
    console.log(`[${req.method}] [${new Date().toLocaleString()}] [${req.path}]`);
    next();
};
exports.methodChecker = methodChecker;
const checkToken = (req, res, next) => {
    if (req.headers['user-id']) {
        const found = userdata_js_1.default.find(iterator => iterator.id === req.headers['user-id']);
        if (found) {
            if (found.tokens-- > 0) {
                console.log(`User ${found.name} has made a request and has ${found.tokens} Tokens now!`);
                res.locals.user = found.name;
                next();
            }
            else {
                res.status(403).send("You have used all of your Tokens.");
            }
        }
        else {
            res.status(403).send("I dont even know who you are!");
        }
    }
    else {
        res.status(403).send("You have no permissions to enter this restricted area!");
    }
};
exports.checkToken = checkToken;
