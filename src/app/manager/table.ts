import {IBook} from '../interface/book.interface';

export class TableManager {
    public SBody : string;
    public STable : string;
    public SPagination : string;

    constructor(selector : string){
        this.STable = selector;
        this.SBody = 'TableBody' + (new Date().getTime());
        $(selector + ' > tbody').attr('id', this.SBody);

        // Pagination is used to show the pages
        this.SPagination = 'TablePagination' + (new Date().getTime());
        $( selector ).after('<div class="pagination-content" id="' + this.SPagination + '"></div>');
    }

    addRow(book : IBook){
        let rowHTML : string = '<tr>';
        rowHTML += '<td>' + book.name + '</td>';
        rowHTML += '<td>' + book.published + '</td>';
        rowHTML += '<td>' + book.genre + '</td>';
        rowHTML += '<td>' + book.author.name + '</td>';
        rowHTML += '</tr>';
        document.getElementById(this.SBody).innerHTML += rowHTML;
    }

    resetRows(){
        document.getElementById(this.SBody).innerHTML = '';
    }

    populateRows(itens){
        this.resetRows();
        itens.map((item) => {
            this.addRow(item);
        });
    }

    insertOnPagination(HTMLString : string){
        document.getElementById(this.SPagination).innerHTML = HTMLString;
    }
};