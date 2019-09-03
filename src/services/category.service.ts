import { Injectable, Scope } from "@nestjs/common";
import { AddCategoryModel } from "models/category/addCategory.model";
import { CategoryRepository } from "repositories/category.repository";
import { GetCategoriesModel } from "models/category/getCategories.model";
import { BookRepository } from "repositories/book.repository";
import * as Lodash  from 'lodash';
import { GetCategoriesItemModel } from "models/category/getCategoriesItem.model";
import { CategoryEntity } from "entities/category.entity";
import { UpdateCategoryModel } from "models/category/updateCategory.model";
import { GetSelectCategoryModel } from "models/category/getSelectCategory.model";
import { MagazineRepository } from "repositories/magazine.repository";

@Injectable({
    scope: Scope.REQUEST
})
export class CategoryService{

    constructor(private categoryRepository: CategoryRepository,
        private bookRepository: BookRepository,
        private magazineRepository: MagazineRepository){
    }

    async addCategory(model: AddCategoryModel): Promise<string>{
        let newCategory = new CategoryEntity();
        newCategory.name = model.name;
        newCategory.description = model.description;
        this.categoryRepository.create({
            name: model.name,
            description: model.description
        });
        this.categoryRepository.save(newCategory);

        return "Category successfully added."
    }

    async getCategories(): Promise<GetCategoriesModel>{
        let categories = await this.categoryRepository.find({});
        let responseItems = Lodash.map(categories, (category) => {
            let responseItem = new GetCategoriesItemModel;
            responseItem.id = category.id.toString();
            responseItem.name = category.name;
            responseItem.description = category.description;
            return responseItem;
        }) as Array<GetCategoriesItemModel>;

        for(let i = 0; i < responseItems.length; i++){
            let responseItem = responseItems[i];
            responseItem.booksCount = (await this.bookRepository.
                find({categoryId: responseItem.id })).length;
            responseItem.magazinesCount = (await this.magazineRepository.
                find({categoryId: responseItem.id})).length; 
        }

        let response = new GetCategoriesModel;
        response.categories = responseItems;

        return response;
    }

    async getCategoriesForSelect(): Promise<Array<GetSelectCategoryModel>>{
        const categories = await this.categoryRepository.find();

        return Lodash.map(categories, (category) => {
            const selectCategory = new GetSelectCategoryModel();
            selectCategory.id = category.id;
            selectCategory.name = category.name;
            return selectCategory;
        })
    }

    async deleteCategory(id: string): Promise<string>{
        await this.magazineRepository.delete({categoryId: id});
        await this.bookRepository.delete({categoryId: id});
        await this.categoryRepository.delete(id);
        
        return "Category successfully delete."
    }

    async updateCategory(model: UpdateCategoryModel): Promise<String>{
        await this.categoryRepository.update(model.id, 
            { name: model.name, description: model.description });
        return "Category successfully update."
    }
}