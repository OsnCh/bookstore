import { GetCategoriesItemModel } from "./getCategoriesItem.model";
import { ApiModelProperty } from "@nestjs/swagger";

export class GetCategoriesModel{
    @ApiModelProperty()
    categories: Array<GetCategoriesItemModel>
}