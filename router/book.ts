import express from 'express';
import book from '../type/book.js';
import data from '../data/data.js';

const app = express.Router();


app.get('/health',(req : book.Request, res : book.Response)=> {
    res.status(200).send('Good Health');
})

app.get('/',(req : book.Request ,res : book.Response)=> {
    const title = req.query.title as string;
    const publicationYear = parseInt(req.query.publicationYear as string);
    let newData = data;
    if(title && publicationYear) {
        newData = data.filter(iterator=> {
            return iterator.title.toLowerCase() === title.toLowerCase() && iterator.publicationYear === publicationYear;
        });
    }
    else if(title) {
    newData = data.filter(iterator=> {
        return iterator.title.toLowerCase() === title.toLowerCase();
    });
    }
    else if(publicationYear) {
    const newData = data.filter(iterator=> iterator.publicationYear === publicationYear);
    }  
    if(!newData.length)
        res.status(404).send("No data to show.");

    const page = parseInt(req.query.page as string) | 0;
    
    const pageSize : number = 5;
    const filteredArray = newData.slice((page-1)*pageSize,pageSize*page);
    const totalPages : number = Math.ceil(filteredArray.length/pageSize)
    
    res.status(201).send({totalPages: totalPages,currentPage: page,pageSize: pageSize,item: filteredArray}) 
});



app.get('/search',(req: book.Request, res: book.Response)=> {

    if(typeof req.query.search === "string")
    {    
        const id = parseInt(req.query.search);
        if(isNaN(id))
            res.status(400).send("Send a valid id number");
        const found = data.find(iterator => iterator.id === id)
        if(found)
            res.status(200).send(found);
        res.status(404).send("Book Not found.");
    }
    else {
        res.status(400).send('Invalid search query.');
    }
})

app.post('/',(req : book.Request, res : book.Response)=> {
    
    if(!req.body.id || !req.body.title || !req.body.author || !req.body.publicationYear)
        res.status(400).send(`invalid Requirement title and publicationYear and author must be specified`);

    const newBook : book.bookItem = {
        id:req.body.id,
        title: req.body.title,
        author: req.body.author,
        publicationYear: req.body.publicationYear,
    };
    
    const ok = data.findIndex(iterator=> iterator.id == newBook.id);
    console.log(~ok);
    
    if(~ok){
        res.status(400).send(`User already exists on our 'so-called' database!`);
    }
    data.unshift(newBook);
    res.status(200).send("User has been successfully added to our DB");
});

app.put('/:id', (req : book.Request, res : book.Response)=> {
    const id = parseInt(req.params.id);
    if(isNaN(id))
        res.status(400).send("Provide a valid number!");

    const ok = data.findIndex(iterator=> iterator.id == id);
    
    if(~ok){
        for(let o =0; o < data.length;o++) {
            if(data[o].id === id)
            {
                data[o] = {...data[o], ...req.body};
                res.status(200).send("Updated successfully.");
            }
    }
}
    res.status(404).send("Failed to update, book does not exist?");
});

app.delete('/:id',(req : book.Request, res : book.Response)=> {
    const id = parseInt(req.params.id);
    if(isNaN(id))
        res.status(400).send("Provide a valid number!");

    const ok = data.findIndex(iterator=> iterator.id == id);
    if(~ok) {
        const newData = data.splice(ok,1);
        res.status(200).send("Book has been deleted!");
    }
    res.send("Book does not exist on this database.");
})

export default app;