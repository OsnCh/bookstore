import { Injectable } from "@nestjs/common";
import { BookRepository } from "repositories/book.repository";
import { AddBookModel } from "models/book/addBook.model";
import { GetBooksModel } from "models/book/getBooks.model";
import * as Lodash  from 'lodash';
import { GetBooksItemModel } from "models/book/getBooksItem.model";
import { CategoryRepository } from "repositories/category.repository";
import { UpdateBookModel } from "models/book/updateBook.model";
import { BookEntity } from "entities/book.entity";
import { GetSelectCategoryModel } from "models/category/getSelectCategory.model";
import { ApplicationException } from "common/exceptions/application.exception";
import { GetBookModel } from "models/book/getBook.model";

@Injectable()
export class BookService{
    constructor(private bookRepository: BookRepository,
        private categoryRepository: CategoryRepository){}

    async addBook(model: AddBookModel):Promise<string>{
        let newBook = this.bookRepository.create({
            price: model.price,
            name: model.name,
            categoryId: model.categoryId,
            isActive: true,
            description: model.description
        })
        this.bookRepository.save(newBook);
        
        return "Book successfully added.";
    } 
    
    async getBook(id: string): Promise<GetBookModel>{
        let book = await this.bookRepository.findOne(id);
        if(!book){
            return null;
        }
        let category = await this.categoryRepository.findOne(book.categoryId);
        let bookModel = new GetBookModel();
        bookModel.id = book.id.toString();
        bookModel.price = book.price;
        bookModel.name = book.name;
        bookModel.description = book.description;
        if(category){
            bookModel.categoryName = category.name;
        }
        return bookModel;
    }

    async getAllBooks(isAdmin: boolean, categories: Array<GetSelectCategoryModel>): Promise<GetBooksModel>{
        let books = await this.bookRepository.find((isAdmin)?{}:{isActive: true});
        let booksResponse = this.mapBooksArray(books, categories)

        return this.mapGetBooksResponse(booksResponse, categories);
    }

    async getBooksByCategory(categoryId: string, isAdmin: boolean, categories: Array<GetSelectCategoryModel>): Promise<GetBooksModel>{
        let category = categories.find((categoryItem) => categoryItem.id == categoryId);
        if(!category){
            throw new ApplicationException('Category not found.');
        }
        let books = await this.bookRepository.find((isAdmin)?
            {categoryId: categoryId}:
            {isActive: true,categoryId: categoryId});
        let booksResponse = this.mapBooksArray(books, category);

        return this.mapGetBooksResponse(booksResponse, categories);
    }

    private mapBooksArray(books: Array<BookEntity>, 
        categories: Array<GetSelectCategoryModel> | GetSelectCategoryModel): Array<GetBooksItemModel>{
            let booksResponse = Lodash.map(books, (book) => {
                let bookModel = new GetBooksItemModel;
                bookModel.category = (categories instanceof GetSelectCategoryModel)?
                    categories : categories.find((category) => category.id == book.categoryId);
                bookModel.description = book.description;
                bookModel.id = book.id;
                bookModel.name = book.name;
                bookModel.price = book.price;
                bookModel.isActive = book.isActive;
                return bookModel;
            }) as Array<GetBooksItemModel>;
            return booksResponse;
    }

    private mapGetBooksResponse(books: Array<GetBooksItemModel>, 
        categories: Array<GetSelectCategoryModel>): GetBooksModel{
            const response = new GetBooksModel;
            response.books = books;
            response.categories = categories;
            return response;
    }

    async deleteBook(id: string): Promise<string>{
        await this.bookRepository.delete(id);
        return "Book successfully delete."
    }

    async deleteBooks(ids: Array<string>): Promise<string>{
        await this.bookRepository.delete(ids);
        return "Books successfully delete."
    }

    async updateBook(model: UpdateBookModel):Promise<string>{
        await this.bookRepository.update(model.id, {
            price: model.price,
            categoryId: model.categoryId,
            name: model.name,
            isActive: model.isActive,
            description: model.description
        });

        return 'Book is successfully updated';
    }
}