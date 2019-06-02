import { Injectable } from "@nestjs/common";
import { BookRepository } from "src/repositories/book.repository";
import { AddBookModel } from "src/models/book/addBook.model";
import { ObjectID } from "typeorm";
import { GetBooksModel } from "src/models/book/getBooks.model";
import * as Lodash  from 'lodash';
import { GetBooksItemModel } from "src/models/book/getBooksItem.model";
import { CategoryRepository } from "src/repositories/category.repository";
import { UpdateBookModel } from "src/models/book/updateBook.model";
import { GetBookSelectCategoryModel } from "src/models/book/getBookSelectCategory.model";
import { BookEntity } from "src/entities/book.entity";

@Injectable()
export class BookService{
    constructor(private bookRepository: BookRepository,
        private categoryRepository: CategoryRepository){}

    async addBook(model: AddBookModel):Promise<string>{
        let newBook = this.bookRepository.create({
            price: model.price,
            name: model.name,
            categoryId: new ObjectID(model.categoryId),
            isActive: true,
            description: model.description
        })
        this.bookRepository.save(newBook);
        
        return "Book successfully added.";
    }  

    async getAllBooks(isAdmin: boolean): Promise<GetBooksModel>{
        let books = await this.bookRepository.find((isAdmin)?{}:{isActive: true});
        let categories = await this.getCategories();
        let booksResponse = this.mapBooksArray(books, categories)

        return this.mapGetBooksResponse(booksResponse, categories);
    }

    async getBooksByCategory(categoryId: string, isAdmin: boolean): Promise<GetBooksModel>{
        let categories = await this.getCategories();
        let category = categories.find((categoryItem) => categoryItem.id == categoryId);
        if(!category){
            throw new Error('Category not found.');
        }
        let books = await this.bookRepository.find((isAdmin)?
            {categoryId: categoryId}:
            {isActive: true,categoryId: categoryId});
        let booksResponse = this.mapBooksArray(books, category);

        return this.mapGetBooksResponse(booksResponse, categories);
    }

    private async getCategories(): Promise<Array<GetBookSelectCategoryModel>>{
        const categories = await this.categoryRepository.find();
        return Lodash.map(categories, (category)=>{
            let selectCategory = new GetBookSelectCategoryModel;
            selectCategory.id = category.id;
            selectCategory.name = category.name;
            return selectCategory;
        })
    }

    private mapBooksArray(books: Array<BookEntity>, 
        categories: Array<GetBookSelectCategoryModel> | GetBookSelectCategoryModel): Array<GetBooksItemModel>{
            let booksResponse = Lodash.map(books, (book) => {
                let bookModel = new GetBooksItemModel;
                bookModel.category = (categories instanceof GetBookSelectCategoryModel)?
                    categories : categories.find((category) => category.id == bookModel.id);
                bookModel.description = book.description;
                bookModel.id = book.id;
                bookModel.name = book.name;
                bookModel.price = book.price;
                return bookModel;
            }) as Array<GetBooksItemModel>;
            return booksResponse;
    }

    private mapGetBooksResponse(books: Array<GetBooksItemModel>, 
        categories: Array<GetBookSelectCategoryModel>): GetBooksModel{
            const response = new GetBooksModel;
            response.books = books;
            response.categories = categories;
            return response;
    }

    async deleteBook(id: string): Promise<string>{
        await this.bookRepository.delete({id: id});
        return "Book successfully delete."
    }

    async updateBook(model: UpdateBookModel):Promise<string>{
        await this.bookRepository.update(model.id, {
            price: model.price,
            categoryId: new ObjectID(model.categoryId),
            name: model.name,
            isActive: model.isActive,
            description: model.description
        });

        return 'Book successfully update';
    }
}