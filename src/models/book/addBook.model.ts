import { ApiModelProperty } from "@nestjs/swagger/dist";

export class AddBookModel{
    @ApiModelProperty()
    price: number;
    @ApiModelProperty()
    categoryId: string;
    @ApiModelProperty()
    name: string;
    @ApiModelProperty()
    description: string;
}