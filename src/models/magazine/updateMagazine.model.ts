import { ApiModelProperty } from "@nestjs/swagger";

export class UpdateMagazineModel{
    @ApiModelProperty()
    id: string;
    @ApiModelProperty()
    price: number;
    @ApiModelProperty()
    categoryId: string;
    @ApiModelProperty()
    name: string;
    @ApiModelProperty()
    description: string;
    @ApiModelProperty()
    isActive: boolean;
}