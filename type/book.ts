import express from 'express';

namespace Book {

    export interface bookItem {
        id : number;
        title: string;
        author: string;
        publicationYear: number;
    };

    export interface Request extends express.Request {
        body : bookItem;
    }

    export interface Response extends express.Response {
        send: (data: bookItem | Array<bookItem> | string | { 
            totalPages: number,
            currentPage: number,
            pageSize: number,
            item: Array<bookItem>,
        })=>this;
    }
}

export default Book;