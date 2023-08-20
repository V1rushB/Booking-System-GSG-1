import express from 'express';
import bookapp from './router/book.js';
import {methodChecker,checkToken} from './middleware/checker.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

//app.use('/',methodChecker);
app.use('/',checkToken);
app.use('/Books',bookapp)

app.use((req, res) => {
    res.status(404).send("You requested something does not exist :(");
})

app.listen(PORT,() => {
    console.log(`App is running on PORT ${PORT}`);
});