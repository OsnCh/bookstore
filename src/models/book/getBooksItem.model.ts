import { GetBookSelectCategoryModel } from "./getBookSelectCategory.model";

export class GetBooksItemModel{
    id: string
    price: number;
    category: GetBookSelectCategoryModel;
    name: string;
    description: string;
    isActive: boolean;
}