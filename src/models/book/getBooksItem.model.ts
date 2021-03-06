import { GetSelectCategoryModel } from "../category/getSelectCategory.model";
import { ApiModelProperty } from "@nestjs/swagger";

export class GetBooksItemModel{
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