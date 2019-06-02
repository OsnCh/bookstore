import { ApiModelProperty } from "@nestjs/swagger";

export class AddCategoryModel{
    @ApiModelProperty()
    name: string;
    @ApiModelProperty()
    description: string;
}