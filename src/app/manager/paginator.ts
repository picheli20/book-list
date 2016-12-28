import { TableManager } from './table';
import { loader } from '../loader/loader';

export class Paginator<T> {
    private originalItens: T[];
    private itens: T[];
    private tableManager: TableManager;
    private currentPage: number = 0;
    private pageSize: number;
    private totalPages: number;
    private lastOrderedItem: string;

    constructor(tableManager: TableManager, pageSize: number = 100, start: boolean = true) {
        this.tableManager = tableManager;
        this.pageSize = pageSize;
        this.eneableGlobal();

    }

    eneableGlobal() {
        var self = this;
        window['next'] = function () { self.next(); };
        window['previus'] = function () { self.previus(); };
        window['goToPage'] = function (i: number) { self.goToPage(i); };
        window['filter'] = function () { self.filter(); };
        window['sort'] = function (i: string, x?: string) { self.sort(i, x); };
    }

    refresh() {

        this.totalPages = Math.ceil(this.itens.length / this.pageSize);
        let paginedItens = this.itens.slice(this.currentPage * this.pageSize, (this.currentPage + 1) * this.pageSize);
        this.tableManager.populateRows(paginedItens);
        this.insertPages();
    }

    resetIcons() {
        $(this.tableManager.STable + ' .fa').removeClass('fa-sort-asc');
        $(this.tableManager.STable + ' .fa').removeClass('fa-sort-desc');
        $(this.tableManager.STable + ' .fa').addClass('fa-sort');
    }

    // Toggle icons position and return if is asc ordered
    toggleIcons(attr: string): boolean {
        if (this.lastOrderedItem != attr) {
            this.lastOrderedItem = attr;
            this.resetIcons();
        }

        let element = $('.' + attr + ' i');
        let isAsc = true;

        if (element.hasClass('fa-sort')) {
            element.removeClass('fa-sort');
            element.addClass('fa-sort-asc');
        } else {
            isAsc = !element.hasClass('fa-sort-asc');
            element.toggleClass('fa-sort-asc');
            element.toggleClass('fa-sort-desc');
        }
        return isAsc;
    }

    // TODO create a filter class
    // TODO remove hard coded and be more generic
    filter() {
        let author = $('#author').val() || [];
        let book = $('#book').val() || [];
        let datepicker = $('#datepicker').val();
        let weekdays = [];
        $.each($("input[name='weekdays']:checked"), function () {
            weekdays.push($(this).val());
        });

        this.itens = this.originalItens.filter((item) => {
            let authorFilter        = author.indexOf(item['author']['gender']) > -1;
            let bookFilter          = book.indexOf(item['genre']) > -1;
            let weekdaysFilter      = weekdays.indexOf(new Date(item['published']).getDay() + '') > -1;
            let datepickerFilter    = datepicker == item['published'];
            
            if (book.length > 0 || author.length > 0 || weekdays.length > 0 || datepicker) {
                return  (author.length == 0 || authorFilter) && 
                        (book.length == 0 || bookFilter) && 
                        (weekdays.length == 0 || weekdaysFilter) && 
                        (!datepicker || datepickerFilter);
            } else {
                return true;
            }
        });

        this.refresh();
    }

    // TODO create a sort class
    sort(attr: string, authorAttr: string = '') {
        let isAsc = this.toggleIcons(attr);

        this.itens = this.itens.sort(function (a, b) {
            let newAttr = attr;
            let ret = 0;
            // if its by autor, go 1 level deep
            if (authorAttr) {
                a = a[attr];
                b = b[attr];
                newAttr = authorAttr;
            }

            if (a[newAttr] > b[newAttr]) ret = 1;
            if (a[newAttr] < b[newAttr]) ret = -1;
            // multiply by -1 to reverse
            return isAsc ? ret : ret * -1;
        });

        this.currentPage = 0;
        this.refresh();
    }

    start(itens: T[]) {
        this.originalItens = itens;
        this.itens = itens;
        this.refresh();
    }

    canGoNext(): boolean {
        // Check if the next page will not pass the totalPages
        // I'm adding 2 because the currentPage starts on 0 and totalPages 1, and one more to simulate the next page
        return this.currentPage + 2 <= this.totalPages;
    }

    canGoPrevius(): boolean {
        return this.currentPage > 0;
    }

    next() {
        if (this.canGoNext()) { this.currentPage++; }
        this.refresh();
    }

    previus() {
        if (this.canGoPrevius()) { this.currentPage--; }
        this.refresh();
    }

    goToPage(i: number) {
        if (i < this.totalPages && i >= 0) { this.currentPage = i; }
        this.refresh();
    }

    insertPages() {
        let paginationHTML = '<p class="total text-right">Total: ' + this.itens.length + '</p>';
        paginationHTML += '<button class="btn btn-primary" onclick="next()" ' + (this.canGoNext() ? '' : 'disabled') + '>Next</button>';
        paginationHTML += '<select class="form-control" class="pages" onchange="goToPage(Number(this.value))">';
        for (let i = 0; i < this.totalPages; i++) {
            paginationHTML += '<option value="' + i + '" ' + (i == this.currentPage ? 'selected' : '') + '>' + (i + 1) + '</option>';
        }
        paginationHTML += '</select>';
        paginationHTML += '<button class="btn btn-primary" onclick="previus()" ' + (this.canGoPrevius() ? '' : 'disabled') + '>Previus</button>';
        paginationHTML += '<div class="clearfix"></div>';
        this.tableManager.insertOnPagination(paginationHTML);
    }


}