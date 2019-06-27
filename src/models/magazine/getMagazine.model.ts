import { ApiModelProperty } from "@nestjs/swagger";
import { GetMagazinesItemModel } from "./getMagazinesItem.model";
import { GetSelectCategoryModel } from "../category/getSelectCategory.model";

export class GetMagazineModel{
    @ApiModelProperty()
    magazine: GetMagazinesItemModel
    @ApiModelProperty()
    categories: GetSelectCategoryModel[]
}