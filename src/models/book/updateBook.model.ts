import { ApiModelProperty } from "@nestjs/swagger";

export class UpdateBookModel{
    @ApiModelProperty()
    id: string;
    @ApiModelProperty()
    price: number;
    @ApiModelProperty()
    categoryId: string;
    @ApiModelProperty()
    name: string;
    @ApiModelProperty()
    isActive: boolean;
    @ApiModelProperty()
    description: string;
}