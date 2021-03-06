import { ApiModelProperty } from "@nestjs/swagger";

export class UpdateCategoryModel {
    @ApiModelProperty()
    id: string;
    @ApiModelProperty()
    name: string;
    @ApiModelProperty()
    description: string;
}