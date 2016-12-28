/// <reference path="../../typings/index.d.ts" />

import { IBook } from './interface/book.interface';
import { loader } from './loader/loader'
import { TableManager } from './manager/table'
import { Paginator } from './manager/paginator'

let bookTable = new TableManager('#bookTable');
let paginator = new Paginator<IBook>(bookTable);

function init(){
    $('#datepicker').datepicker();
    $( "#datepicker" ).datepicker( 'option', 'dateFormat', 'yy-mm-dd');

    loader.add();

    $.ajax({
        url: "assets/data/book-list.json",
        context: document.body,
        success: (bookList: IBook[]) => {
            paginator.start(bookList);
            loader.remove();
        }
    });
}

init();