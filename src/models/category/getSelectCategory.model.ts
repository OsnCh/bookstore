import { ApiModelProperty } from "@nestjs/swagger";

export class GetSelectCategoryModel{
    @ApiModelProperty()
    id: string;
    @ApiModelProperty()
    name: string;
}