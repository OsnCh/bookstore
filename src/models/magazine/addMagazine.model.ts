import { ApiModelProperty } from "@nestjs/swagger";

export class AddMagazineModel{
    @ApiModelProperty()
    price: number;
    @ApiModelProperty()
    categoryId: string;
    @ApiModelProperty()
    name: string;
    @ApiModelProperty()
    description: string;
}