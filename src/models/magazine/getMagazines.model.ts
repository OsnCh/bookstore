import { ApiModelProperty } from "@nestjs/swagger";
import { GetMagazinesItemModel } from "./getMagazinesItem.model";
import { GetSelectCategoryModel } from "../category/getSelectCategory.model";

export class GetMagazinesModel{
    @ApiModelProperty()
    magazines: GetMagazinesItemModel[]
    @ApiModelProperty()
    categories: GetSelectCategoryModel[]
}