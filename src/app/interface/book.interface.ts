import {IAuthor} from "./author.interface";

export interface IBook{
    name : string,
    genre : string,
    published : string,
    author: IAuthor
}