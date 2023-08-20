"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const data_js_1 = __importDefault(require("../data/data.js"));
const app = express_1.default.Router();
app.get('/', (req, res) => {
    const title = req.query.title;
    const publicationYear = parseInt(req.query.publicationYear);
    let newData = data_js_1.default;
    if (title && publicationYear) {
        newData = data_js_1.default.filter(iterator => {
            return iterator.title.toLowerCase() === title.toLowerCase() && iterator.publicationYear === publicationYear;
        });
    }
    else if (title) {
        newData = data_js_1.default.filter(iterator => {
            return iterator.title.toLowerCase() === title.toLowerCase();
        });
    }
    else if (publicationYear) {
        const newData = data_js_1.default.filter(iterator => iterator.publicationYear === publicationYear);
    }
    if (!newData.length)
        res.status(404).send("No data to show.");
    const page = parseInt(req.query.page) | 0;
    const pageSize = 5;
    const filteredArray = newData.slice((page - 1) * pageSize, pageSize * page);
    const totalPages = Math.ceil(filteredArray.length / pageSize);
    res.status(201).send({ totalPages: totalPages, currentPage: page, pageSize: pageSize, item: filteredArray });
});
app.get('/search', (req, res) => {
    if (typeof req.query.search === "string") {
        const id = parseInt(req.query.search);
        if (isNaN(id))
            res.status(400).send("Send a valid id number");
        const found = data_js_1.default.find(iterator => iterator.id === id);
        if (found)
            res.status(200).send(found);
        res.status(404).send("Book Not found.");
    }
    else {
        res.status(400).send('Invalid search query.');
    }
});
app.post('/', (req, res) => {
    if (!req.body.id || !req.body.title || !req.body.author || !req.body.publicationYear)
        res.status(400).send(`invalid Requirement title and publicationYear and author must be specified`);
    const newBook = {
        id: req.body.id,
        title: req.body.title,
        author: req.body.author,
        publicationYear: req.body.publicationYear,
    };
    const ok = data_js_1.default.findIndex(iterator => iterator.id == newBook.id);
    console.log(~ok);
    if (~ok) {
        res.status(400).send(`User already exists on our 'so-called' database!`);
    }
    data_js_1.default.unshift(newBook);
    res.status(200).send("User has been successfully added to our DB");
});
app.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id))
        res.status(400).send("Provide a valid number!");
    const ok = data_js_1.default.findIndex(iterator => iterator.id == id);
    if (~ok) {
        for (let o = 0; o < data_js_1.default.length; o++) {
            if (data_js_1.default[o].id === id) {
                data_js_1.default[o] = Object.assign(Object.assign({}, data_js_1.default[o]), req.body);
                res.status(200).send("Updated successfully.");
            }
        }
    }
    res.status(404).send("Failed to update, book does not exist?");
});
app.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id))
        res.status(400).send("Provide a valid number!");
    const ok = data_js_1.default.findIndex(iterator => iterator.id == id);
    if (~ok) {
        const newData = data_js_1.default.splice(ok, 1);
        res.status(200).send("Book has been deleted!");
    }
    res.send("Book does not exist on this database.");
});
exports.default = app;
