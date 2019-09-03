import { Injectable } from "@nestjs/common";
import { MagazineRepository } from "repositories/magazine.repository";
import { AddMagazineModel } from "models/magazine/addMagazine.model";
import { UpdateMagazineModel } from "models/magazine/updateMagazine.model";
import { GetSelectCategoryModel } from "models/category/getSelectCategory.model";
import * as Lodash  from 'lodash';
import { GetMagazinesItemModel } from "models/magazine/getMagazinesItem.model";
import { GetMagazinesModel } from "models/magazine/getMagazines.model";
import { MagazineEntity } from "entities/magazine.entity";

@Injectable()
export class MagazineService {
    constructor(private magazineRepository: MagazineRepository){}

    async addMagazine(model: AddMagazineModel): Promise<string>{
        let magazineEntity = this.magazineRepository.create({
            price: model.price,
            name: model.name,
            description: model.description,
            categoryId: model.categoryId,
            isActive: true
        });
        await this.magazineRepository.save(magazineEntity);
        return 'Magazine successfully added.'
    }

    async updateMagazine(model: UpdateMagazineModel): Promise<string>{
        await this.magazineRepository.update(model.id, {
            price: model.price,
            categoryId: model.categoryId,
            name: model.name,
            description: model.description,
            isActive: model.isActive
        });

        return 'Magazine successfully update.'
    }

    async deleteMagazine(id:string):Promise<string>{
        await this.magazineRepository.delete({id: id});
        return 'Magazine successfully delete.'
    }

    async getAllMagazines(isAdmin: boolean, 
        categories: Array<GetSelectCategoryModel>): Promise<GetMagazinesModel>{
            let magazines = await this.magazineRepository.find(isAdmin?{}:{isActive:true});
            let magazinesModels = this.mapGetMagazines(magazines, categories);

            return this.mapGetResponse(magazinesModels, categories);
        }
    
    async getMagazinesByCategory(categoryId: string, 
        isAdmin: boolean, categories: Array<GetSelectCategoryModel>): Promise<GetMagazinesModel>{
            let magazines = await this.magazineRepository.
                find(isAdmin?{categoryId: categoryId}:
                    {isActive:true, categoryId: categoryId});
            let category = categories.find((item) => item.id == categoryId);
            let magazineModels = this.mapGetMagazines(magazines, category);

            return this.mapGetResponse(magazineModels, categories);
        }

    async getMagazineById(id: string, categories: Array<GetSelectCategoryModel>): Promise<GetMagazinesItemModel>{
        let magazine = await this.magazineRepository.findOne(id);
        if(!magazine){
            return null;
        }

        let magazineModel = new GetMagazinesItemModel;
        magazineModel.id = magazine.id.toString();
        magazineModel.category = categories.find(v => v.id == magazine.categoryId.toString());
        magazineModel.description = magazine.description;
        magazineModel.isActive = magazine.isActive;
        magazineModel.name = magazine.name;
        magazineModel.price = magazine.price;

        return magazineModel;
    }
    
    private mapGetMagazines(magazineEntities: Array<MagazineEntity>, 
        categories: Array<GetSelectCategoryModel> | GetSelectCategoryModel){
            let magazinesModels = Lodash.map(magazineEntities, (magazine) => {
                let magazineItemModel = new GetMagazinesItemModel;
                magazineItemModel.category = (categories instanceof GetSelectCategoryModel)?
                    categories:
                    categories.find((it) => it.id == magazine.categoryId);
                magazineItemModel.description = magazine.description;
                magazineItemModel.id = magazine.id;
                magazineItemModel.isActive = magazine.isActive;
                magazineItemModel.name = magazine.name;
                magazineItemModel.price = magazine.price;
                return magazineItemModel;
            });
            return magazinesModels;
    }

    private mapGetResponse(magazines: Array<GetMagazinesItemModel>, 
        categories: Array<GetSelectCategoryModel>){
            const response = new GetMagazinesModel();
            response.magazines = magazines;
            response.categories = categories;
            return response;
        }
    
    async deleteMany(ids: Array<string>): Promise<string>{
        await this.magazineRepository.delete(ids);

        return 'Magazines successfully delete.';
    }
}