import { Injectable } from "@nestjs/common";
import { AddCategoryModel } from "src/models/category/addCategory.model";
import { CategoryRepository } from "src/repositories/category.repository";
import { GetCategoriesModel } from "src/models/category/getCategories.model";
import { BookRepository } from "src/repositories/book.repository";
import * as Lodash  from 'lodash';
import { GetCategoriesItemModel } from "src/models/category/getCategoriesItem.model";
import { CategoryEntity } from "src/entities/category.entity";
import { UpdateCategoryModel } from "src/models/category/updateCategory.model";

@Injectable()
export class CategoryService{

    constructor(private categoryRepository: CategoryRepository,
        private bookRepository: BookRepository){

    }

    async addCategory(model: AddCategoryModel): Promise<string>{
        let newCategory = new CategoryEntity;
        newCategory.name = model.name;
        newCategory.description = model.description;
        console.log(newCategory);
        this.categoryRepository.create(newCategory)
        this.categoryRepository.save(newCategory);

        return "Category successfully added."
    }

    async getCategories(): Promise<GetCategoriesModel>{
        let categories = await this.categoryRepository.find({});
        console.log(categories);
        let responseItems = Lodash.map(categories, (category) => {
            let responseItem = new GetCategoriesItemModel;
            responseItem.id = category.id.toString();
            responseItem.name = category.name;
            responseItem.description = category.description;
            return responseItem;
        }) as Array<GetCategoriesItemModel>;

        for(let i=0; i < responseItems.length; i++){
            let responseItem = responseItems[i];
            responseItem.booksCount = (await this.bookRepository.
                find({categoryId: responseItem.id })).length;
            responseItem.magazinesCount = 0; //TODO: calculate count magazines by category
        }

        let response = new GetCategoriesModel;
        response.categories = responseItems;

        return response;
    }

    async deleteCategory(id: string): Promise<String>{

        //TODO: delete magazines
        //TODO: find out about the transaction

        /*let resultDeleteBooks = */await this.bookRepository.delete({categoryId: id});
        // if(!resultDeleteBooks){
        //     throw new Error("Delete books error");
        // }
        /*let resultDeleteCategory = */await this.categoryRepository.delete(id);
        // if(!resultDeleteCategory){
        //     throw new Error("Delete category error");
        // }

        return "Category successfully delete."
    }

    async updateCategory(model: UpdateCategoryModel): Promise<String>{
        let result = await this.categoryRepository.update(model.id, 
            { name: model.name, description: model.description });
        return "Category successfully update."
    }
}