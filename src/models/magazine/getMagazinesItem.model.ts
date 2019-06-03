import { ApiModelProperty } from "@nestjs/swagger";
import { GetSelectCategoryModel } from "../category/getSelectCategory.model";

export class GetMagazinesItemModel{
    @ApiModelProperty()
    id: string;
    @ApiModelProperty()
    price: number;
    @ApiModelProperty()
    category: GetSelectCategoryModel;
    @ApiModelProperty()
    name: string;
    @ApiModelProperty()
    description: string;
    @ApiModelProperty()
    isActive: boolean;
}